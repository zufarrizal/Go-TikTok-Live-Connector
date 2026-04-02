package main

import (
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"io"
	"log"
	"mime"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"
	"unsafe"

	"github.com/gorcon/rcon"
	"github.com/steampoweredtaco/gotiktoklive"
)

//go:embed web/index.html web/static/**
var embeddedWebFS embed.FS

var (
	appBaseDir    string
	appEventsPath string
	appGiftList   string
	appGiftImage  string
	appSoundsDir  string
)

const defaultUsernameAllowlistURL = "https://raw.githubusercontent.com/zufarrizal/Go-TikTok-Live-Connector/main/username.txt"

type eventHub struct {
	mu      sync.RWMutex
	clients map[chan string]struct{}
}

type githubUsernameAllowlist struct {
	mu         sync.Mutex
	url        string
	ttl        time.Duration
	lastFetch  time.Time
	cachedList map[string]struct{}
}

func newGithubUsernameAllowlist(url string, ttl time.Duration) *githubUsernameAllowlist {
	url = strings.TrimSpace(url)
	if url == "" {
		url = defaultUsernameAllowlistURL
	}
	if ttl <= 0 {
		ttl = 30 * time.Second
	}
	return &githubUsernameAllowlist{
		url:        url,
		ttl:        ttl,
		cachedList: make(map[string]struct{}),
	}
}

func (a *githubUsernameAllowlist) isAllowed(username string) (bool, error) {
	username = normalizeUsername(username)
	if username == "" {
		return false, fmt.Errorf("username is required")
	}

	a.mu.Lock()
	needRefresh := len(a.cachedList) == 0 || time.Since(a.lastFetch) > a.ttl
	a.mu.Unlock()

	if needRefresh {
		if err := a.refresh(); err != nil {
			return false, err
		}
	}

	a.mu.Lock()
	defer a.mu.Unlock()
	_, ok := a.cachedList[username]
	return ok, nil
}

func (a *githubUsernameAllowlist) refresh() error {
	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest(http.MethodGet, a.url, nil)
	if err != nil {
		return fmt.Errorf("failed to build username allowlist request: %w", err)
	}
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("User-Agent", "Go-TikTok-Live-Connector/1.0")

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to fetch username allowlist: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return fmt.Errorf("failed to fetch username allowlist: status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read username allowlist: %w", err)
	}

	lines := strings.Split(string(body), "\n")
	next := make(map[string]struct{}, len(lines))
	for _, line := range lines {
		s := strings.TrimSpace(strings.TrimPrefix(line, "\uFEFF"))
		if s == "" || strings.HasPrefix(s, "#") {
			continue
		}
		username := normalizeUsername(s)
		if username == "" {
			continue
		}
		next[username] = struct{}{}
	}
	if len(next) == 0 {
		return fmt.Errorf("username allowlist is empty")
	}

	a.mu.Lock()
	a.cachedList = next
	a.lastFetch = time.Now()
	a.mu.Unlock()
	return nil
}

func newEventHub() *eventHub {
	return &eventHub{clients: make(map[chan string]struct{})}
}

func (h *eventHub) subscribe() chan string {
	ch := make(chan string, 32)
	h.mu.Lock()
	h.clients[ch] = struct{}{}
	h.mu.Unlock()
	return ch
}

func (h *eventHub) unsubscribe(ch chan string) {
	h.mu.Lock()
	if _, ok := h.clients[ch]; ok {
		delete(h.clients, ch)
		close(ch)
	}
	h.mu.Unlock()
}

func (h *eventHub) broadcast(msg string) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for ch := range h.clients {
		select {
		case ch <- msg:
		default:
		}
	}
}

type streamController struct {
	mu       sync.Mutex
	hub      *eventHub
	onEvent  func(any)
	running  bool
	username string
	session  uint64
	cancel   context.CancelFunc
	live     *gotiktoklive.Live
}

const streamReconnectDelay = 5 * time.Second

func newStreamController(hub *eventHub, onEvent func(any)) *streamController {
	return &streamController{hub: hub, onEvent: onEvent}
}

func (c *streamController) Start(username string) error {
	username = strings.TrimSpace(strings.TrimPrefix(username, "@"))
	if username == "" {
		return fmt.Errorf("username is required")
	}

	c.mu.Lock()
	c.session++
	session := c.session
	if c.cancel != nil {
		c.cancel()
	}
	if c.live != nil {
		c.live.Close()
		c.live = nil
	}
	ctx, cancel := context.WithCancel(context.Background())
	c.cancel = cancel
	c.running = true
	c.username = username
	c.mu.Unlock()

	c.hub.broadcast(mustJSON(map[string]any{
		"type":    "status",
		"message": "Starting @" + username + "...",
		"time":    time.Now().Format(time.RFC3339),
	}))
	go c.run(ctx, session, username)
	return nil
}

func (c *streamController) Stop() {
	c.mu.Lock()
	c.session++
	if c.cancel != nil {
		c.cancel()
	}
	if c.live != nil {
		c.live.Close()
		c.live = nil
	}
	c.cancel = nil
	c.running = false
	c.username = ""
	c.mu.Unlock()

	c.hub.broadcast(mustJSON(map[string]any{
		"type":    "status",
		"message": "Stopped",
		"time":    time.Now().Format(time.RFC3339),
	}))
}

func (c *streamController) State() (bool, string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.running, c.username
}

func (c *streamController) isCurrentSession(session uint64) bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.running && c.session == session
}

func (c *streamController) setLive(session uint64, live *gotiktoklive.Live) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.session == session {
		c.live = live
	}
}

func (c *streamController) broadcastReconnect(username string) {
	c.hub.broadcast(mustJSON(map[string]any{
		"type":    "status",
		"message": fmt.Sprintf("Disconnected from @%s. Reconnecting in %ds...", username, int(streamReconnectDelay/time.Second)),
		"time":    time.Now().Format(time.RFC3339),
	}))
}

func (c *streamController) run(ctx context.Context, session uint64, username string) {
	defer func() {
		if r := recover(); r != nil && c.isCurrentSession(session) {
			c.setLive(session, nil)
			c.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": fmt.Sprintf("tracker panic for @%s: %v", username, r),
				"time":  time.Now().Format(time.RFC3339),
			}))
			c.broadcastReconnect(username)
			if sleepOrCancel(ctx, streamReconnectDelay) {
				go c.run(ctx, session, username)
			}
		}
	}()

	for {
		if !c.isCurrentSession(session) {
			return
		}

		tiktok, err := gotiktoklive.NewTikTok()
		if err != nil {
			c.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": err.Error(),
				"time":  time.Now().Format(time.RFC3339),
			}))
			c.broadcastReconnect(username)
			if !sleepOrCancel(ctx, streamReconnectDelay) {
				return
			}
			continue
		}

		live, err := tiktok.TrackUser(username)
		if err != nil {
			c.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": err.Error(),
				"time":  time.Now().Format(time.RFC3339),
			}))
			c.broadcastReconnect(username)
			if !sleepOrCancel(ctx, streamReconnectDelay) {
				return
			}
			continue
		}
		c.setLive(session, live)

		c.hub.broadcast(mustJSON(map[string]any{
			"type":    "status",
			"message": "Connected to @" + username,
			"time":    time.Now().Format(time.RFC3339),
		}))
		if gifts, err := fetchGiftCatalog(tiktok, live.ID, username); err != nil {
			c.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": "failed to fetch gift catalog: " + err.Error(),
				"time":  time.Now().Format(time.RFC3339),
			}))
		} else {
			downloadedCount, downloadErrs := downloadGiftImages(appGiftImage, gifts)
			if len(downloadErrs) > 0 {
				c.hub.broadcast(mustJSON(map[string]any{
					"type":  "error",
					"error": fmt.Sprintf("gift image download completed with %d error(s): %s", len(downloadErrs), strings.Join(downloadErrs[:min(len(downloadErrs), 3)], "; ")),
					"time":  time.Now().Format(time.RFC3339),
				}))
			}
			outFile, saveErr := saveGiftListJSON(appGiftList, username, gifts)
			if saveErr != nil {
				c.hub.broadcast(mustJSON(map[string]any{
					"type":  "error",
					"error": "failed to save gift list json: " + saveErr.Error(),
					"time":  time.Now().Format(time.RFC3339),
				}))
			} else {
				c.hub.broadcast(mustJSON(map[string]any{
					"type":    "status",
					"message": fmt.Sprintf("Gift list saved to %s and downloaded %d gift image(s) to %s", outFile, downloadedCount, appGiftImage),
					"time":    time.Now().Format(time.RFC3339),
				}))
			}
			c.hub.broadcast(mustJSON(map[string]any{
				"type":     "gift_catalog",
				"username": username,
				"roomID":   live.ID,
				"count":    len(gifts),
				"gifts":    gifts,
				"time":     time.Now().Format(time.RFC3339),
			}))
		}

	eventLoop:
		for {
			select {
			case <-ctx.Done():
				live.Close()
				return
			case event, ok := <-live.Events:
				if !ok {
					break eventLoop
				}
				c.hub.broadcast(mustJSON(map[string]any{
					"type":      "event",
					"eventType": fmt.Sprintf("%T", event),
					"data":      event,
					"time":      time.Now().Format(time.RFC3339),
				}))
				if c.onEvent != nil {
					c.onEvent(event)
				}
			}
		}

		live.Close()
		c.setLive(session, nil)

		c.broadcastReconnect(username)

		if !sleepOrCancel(ctx, streamReconnectDelay) {
			return
		}
	}
}

func sleepOrCancel(ctx context.Context, d time.Duration) bool {
	t := time.NewTimer(d)
	defer t.Stop()
	select {
	case <-ctx.Done():
		return false
	case <-t.C:
		return true
	}
}

type eventRecord struct {
	ID           int    `json:"id"`
	Type         string `json:"type"`
	Title        string `json:"title"`
	Label        string `json:"label"`
	GiftID       int    `json:"gift_id"`
	GiftName     string `json:"gift_name"`
	Diamond      int    `json:"diamond"`
	SoundURL     string `json:"sound_url"`
	MCCommand    string `json:"mc_command"`
	RunMCCommand bool   `json:"run_mc_command"`
	RunShortcut  bool   `json:"run_shortcut"`
	ShortcutKeys string `json:"shortcut_keys"`
	ShortcutHold int    `json:"shortcut_hold_ms"`
}

type eventStore struct {
	mu    sync.Mutex
	path  string
	items []eventRecord
}

type mcRCONConfig struct {
	Enabled  bool   `json:"enabled"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Password string `json:"-"`
}

type mcRCONManager struct {
	mu        sync.Mutex
	cfg       mcRCONConfig
	conn      *rcon.Conn
	connected bool
	lastError string
	propPath  string
}

func newMCRCONManagerFromProperties(path string) *mcRCONManager {
	m := &mcRCONManager{
		cfg: mcRCONConfig{
			Enabled: false,
			Host:    "127.0.0.1",
			Port:    25575,
		},
		propPath: path,
	}
	_ = m.refreshFromPropertiesLocked()
	return m
}

func (m *mcRCONManager) refreshFromPropertiesLocked() error {
	if strings.TrimSpace(m.propPath) == "" {
		return fmt.Errorf("properties path is empty")
	}
	props, err := loadProperties(m.propPath)
	if err != nil {
		m.lastError = "failed load properties: " + err.Error()
		return err
	}
	m.cfg.Enabled = strings.EqualFold(strings.TrimSpace(props["enable-rcon"]), "true")
	if p, ok := props["rcon.password"]; ok {
		m.cfg.Password = strings.TrimSpace(p)
	}
	if v := strings.TrimSpace(props["server-ip"]); v != "" {
		m.cfg.Host = v
	}
	if v := strings.TrimSpace(props["rcon.port"]); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 && n <= 65535 {
			m.cfg.Port = n
		}
	}
	return nil
}

func (m *mcRCONManager) Status() map[string]any {
	m.mu.Lock()
	defer m.mu.Unlock()
	_ = m.refreshFromPropertiesLocked()
	return map[string]any{
		"enabled":         m.cfg.Enabled,
		"host":            m.cfg.Host,
		"port":            m.cfg.Port,
		"connected":       m.connected,
		"last_error":      m.lastError,
		"properties_path": m.propPath,
	}
}

func (m *mcRCONManager) Connect(host string, port int, password string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	host = strings.TrimSpace(host)
	password = strings.TrimSpace(password)
	useManual := host != "" || (port > 0 && port <= 65535) || password != ""

	if useManual {
		if host != "" {
			m.cfg.Host = host
		} else if strings.TrimSpace(m.cfg.Host) == "" {
			m.cfg.Host = "127.0.0.1"
		}
		if port > 0 && port <= 65535 {
			m.cfg.Port = port
		} else if m.cfg.Port <= 0 || m.cfg.Port > 65535 {
			m.cfg.Port = 25575
		}
		if password != "" {
			m.cfg.Password = password
		}
		m.cfg.Enabled = true
	} else {
		_ = m.refreshFromPropertiesLocked()
		if !m.cfg.Enabled {
			m.lastError = "enable-rcon=false in Server/server.properties"
			return errors.New(m.lastError)
		}
	}
	if strings.TrimSpace(m.cfg.Password) == "" {
		if useManual {
			m.lastError = "rcon password is required for manual connect"
		} else {
			m.lastError = "rcon.password is empty"
		}
		return errors.New(m.lastError)
	}
	if m.conn != nil {
		_ = m.conn.Close()
		m.conn = nil
		m.connected = false
	}
	address := fmt.Sprintf("%s:%d", m.cfg.Host, m.cfg.Port)
	conn, err := rcon.Dial(address, m.cfg.Password)
	if err != nil {
		m.lastError = err.Error()
		return err
	}
	m.conn = conn
	m.connected = true
	m.lastError = ""
	return nil
}

func (m *mcRCONManager) Disconnect() {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.conn != nil {
		_ = m.conn.Close()
		m.conn = nil
	}
	m.connected = false
}

func (m *mcRCONManager) Execute(command string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	command = strings.TrimSpace(command)
	if command == "" {
		return "", fmt.Errorf("command is empty")
	}
	if !m.connected || m.conn == nil {
		return "", fmt.Errorf("rcon is not connected")
	}
	out, err := m.conn.Execute(command)
	if err != nil {
		m.lastError = err.Error()
		m.connected = false
		_ = m.conn.Close()
		m.conn = nil
		return "", err
	}
	m.lastError = ""
	return out, nil
}

func newEventStore(path string) (*eventStore, error) {
	s := &eventStore{
		path:  path,
		items: make([]eventRecord, 0),
	}
	if err := s.load(); err != nil {
		return nil, err
	}
	return s, nil
}

func (s *eventStore) load() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, err := os.ReadFile(s.path)
	if err != nil {
		if os.IsNotExist(err) {
			s.items = []eventRecord{}
			return nil
		}
		return err
	}
	if len(strings.TrimSpace(string(b))) == 0 {
		s.items = []eventRecord{}
		return nil
	}

	var items []eventRecord
	if err := json.Unmarshal(b, &items); err != nil {
		return err
	}
	changed := false
	for i := range items {
		beforeRunMC := items[i].RunMCCommand
		beforeRunShortcut := items[i].RunShortcut
		beforeShortcut := strings.TrimSpace(items[i].ShortcutKeys)
		normalizeEventExecutionMode(&items[i])
		if beforeRunMC != items[i].RunMCCommand || beforeRunShortcut != items[i].RunShortcut || beforeShortcut != items[i].ShortcutKeys {
			changed = true
		}
	}
	s.items = items
	if changed {
		if err := s.saveLocked(); err != nil {
			return err
		}
	}
	return nil
}

func (s *eventStore) snapshot() []eventRecord {
	out := make([]eventRecord, len(s.items))
	copy(out, s.items)
	return out
}

func (s *eventStore) list() []eventRecord {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.snapshot()
}

func (s *eventStore) saveLocked() error {
	b, err := json.MarshalIndent(s.items, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.path, b, 0644)
}

func normalizeEventExecutionMode(item *eventRecord) {
	if item == nil {
		return
	}
	item.ShortcutKeys = strings.TrimSpace(item.ShortcutKeys)
	if item.ShortcutHold < 0 {
		item.ShortcutHold = 0
	}
	if item.ShortcutHold > 10000 {
		item.ShortcutHold = 10000
	}
	if item.RunShortcut && item.ShortcutKeys == "" {
		item.RunShortcut = false
	}
	// Backward compatibility for old events.json: if both are false, default to MC command.
	if !item.RunMCCommand && !item.RunShortcut {
		item.RunMCCommand = true
	}
}

func (s *eventStore) nextIDLocked() int {
	maxID := 0
	for _, it := range s.items {
		if it.ID > maxID {
			maxID = it.ID
		}
	}
	return maxID + 1
}

func (s *eventStore) create(eventType, title, label string, giftID int, giftName string, diamond int, soundURL string, mcCommand string, runMCCommand bool, runShortcut bool, shortcutKeys string, shortcutHold int) (eventRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	item := eventRecord{
		ID:           s.nextIDLocked(),
		Type:         strings.TrimSpace(eventType),
		Title:        strings.TrimSpace(title),
		Label:        strings.TrimSpace(label),
		GiftID:       giftID,
		GiftName:     strings.TrimSpace(giftName),
		Diamond:      diamond,
		SoundURL:     strings.TrimSpace(soundURL),
		MCCommand:    strings.TrimSpace(mcCommand),
		RunMCCommand: runMCCommand,
		RunShortcut:  runShortcut,
		ShortcutKeys: strings.TrimSpace(shortcutKeys),
		ShortcutHold: shortcutHold,
	}
	normalizeEventExecutionMode(&item)
	s.items = append(s.items, item)
	if err := s.saveLocked(); err != nil {
		return eventRecord{}, err
	}
	return item, nil
}

func (s *eventStore) update(id int, eventType, title, label string, giftID int, giftName string, diamond int, soundURL string, mcCommand string, runMCCommand bool, runShortcut bool, shortcutKeys string, shortcutHold int) (eventRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.items {
		if s.items[i].ID == id {
			s.items[i].Type = strings.TrimSpace(eventType)
			s.items[i].Title = strings.TrimSpace(title)
			s.items[i].Label = strings.TrimSpace(label)
			s.items[i].GiftID = giftID
			s.items[i].GiftName = strings.TrimSpace(giftName)
			s.items[i].Diamond = diamond
			s.items[i].SoundURL = strings.TrimSpace(soundURL)
			s.items[i].MCCommand = strings.TrimSpace(mcCommand)
			s.items[i].RunMCCommand = runMCCommand
			s.items[i].RunShortcut = runShortcut
			s.items[i].ShortcutKeys = strings.TrimSpace(shortcutKeys)
			s.items[i].ShortcutHold = shortcutHold
			normalizeEventExecutionMode(&s.items[i])
			if err := s.saveLocked(); err != nil {
				return eventRecord{}, err
			}
			return s.items[i], nil
		}
	}
	return eventRecord{}, fmt.Errorf("event id %d not found", id)
}

func (s *eventStore) delete(id int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.items {
		if s.items[i].ID == id {
			s.items = append(s.items[:i], s.items[i+1:]...)
			return s.saveLocked()
		}
	}
	return fmt.Errorf("event id %d not found", id)
}

func (s *eventStore) replaceAll(items []eventRecord) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.items = make([]eventRecord, len(items))
	copy(s.items, items)
	return s.saveLocked()
}

func (s *eventStore) resetAll() error {
	return s.replaceAll([]eventRecord{})
}

func (s *eventStore) rulesForTrigger(eventType string, giftID int) []eventRecord {
	s.mu.Lock()
	defer s.mu.Unlock()
	out := make([]eventRecord, 0)
	for _, it := range s.items {
		if strings.TrimSpace(strings.ToLower(it.Type)) != eventType {
			continue
		}
		if eventType == "gift" && it.GiftID > 0 && giftID > 0 && it.GiftID != giftID {
			continue
		}
		out = append(out, it)
	}
	return out
}

func (s *eventStore) getByID(id int) (eventRecord, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, it := range s.items {
		if it.ID == id {
			return it, true
		}
	}
	return eventRecord{}, false
}

type mcEventAutomation struct {
	store *eventStore
	rcon  *mcRCONManager
	hub   *eventHub
	mu    sync.Mutex
	// Tracks grouped gift combo progression by TikTok GroupID.
	giftCombo map[int64]giftComboProgress
	queue     chan queuedMCTrigger
}

type giftComboProgress struct {
	Last        int
	Max         int
	Sum         int
	SawIncrease bool
}

type queuedMCTrigger struct {
	rule         eventRecord
	eventType    string
	giftID       int
	vars         map[string]string
	command      string
	runMCCommand bool
	shortcutKeys string
	shortcutHold int
	runShortcut  bool
	queuedAt     time.Time
}

func newMCEventAutomation(store *eventStore, rcon *mcRCONManager, hub *eventHub) *mcEventAutomation {
	a := &mcEventAutomation{
		store:     store,
		rcon:      rcon,
		hub:       hub,
		giftCombo: make(map[int64]giftComboProgress),
		queue:     make(chan queuedMCTrigger, 512),
	}
	go a.processQueue()
	return a
}

func (a *mcEventAutomation) processQueue() {
	for job := range a.queue {
		commandOut := ""
		var commandErr error
		if job.runMCCommand {
			commandOut, commandErr = executeCommands(a.rcon, job.command)
		}
		var shortcutErr error
		if job.runShortcut {
			shortcutErr = executeKeyboardShortcut(job.shortcutKeys, job.shortcutHold)
		}
		triggerPayload := map[string]any{
			"type":             "trigger",
			"event_id":         job.rule.ID,
			"event_type":       job.eventType,
			"event_label":      job.rule.Label,
			"gift_id":          job.giftID,
			"gift_name":        job.vars["gift_name"],
			"username":         job.vars["username"],
			"repeat_count":     job.vars["repeat_count"],
			"sound_url":        job.rule.SoundURL,
			"command":          job.command,
			"run_mc_command":   job.runMCCommand,
			"run_shortcut":     job.runShortcut,
			"shortcut_keys":    job.shortcutKeys,
			"shortcut_hold_ms": job.shortcutHold,
			"output":           commandOut,
			"queued_at":        job.queuedAt.Format(time.RFC3339),
			"processed_at":     time.Now().Format(time.RFC3339),
			"queue_pending":    len(a.queue),
		}
		if commandErr != nil {
			triggerPayload["command_error"] = commandErr.Error()
			a.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": fmt.Sprintf("auto MC command failed (event #%d): %v", job.rule.ID, commandErr),
				"time":  time.Now().Format(time.RFC3339),
			}))
		}
		if shortcutErr != nil {
			triggerPayload["shortcut_error"] = shortcutErr.Error()
			a.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": fmt.Sprintf("auto keyboard shortcut failed (event #%d): %v", job.rule.ID, shortcutErr),
				"time":  time.Now().Format(time.RFC3339),
			}))
		}
		a.hub.broadcast(mustJSON(triggerPayload))
	}
}

func (a *mcEventAutomation) enqueueTrigger(job queuedMCTrigger) {
	a.queue <- job
	a.hub.broadcast(mustJSON(map[string]any{
		"type":             "trigger_queued",
		"event_id":         job.rule.ID,
		"event_type":       job.eventType,
		"event_label":      job.rule.Label,
		"gift_id":          job.giftID,
		"gift_name":        job.vars["gift_name"],
		"username":         job.vars["username"],
		"repeat_count":     job.vars["repeat_count"],
		"sound_url":        job.rule.SoundURL,
		"command":          job.command,
		"run_mc_command":   job.runMCCommand,
		"run_shortcut":     job.runShortcut,
		"shortcut_keys":    job.shortcutKeys,
		"shortcut_hold_ms": job.shortcutHold,
		"queued_at":        job.queuedAt.Format(time.RFC3339),
		"queue_pending":    len(a.queue),
		"time":             time.Now().Format(time.RFC3339),
	}))
}

func (a *mcEventAutomation) HandleLiveEvent(ev any) {
	if !a.shouldProcessEvent(ev) {
		return
	}
	eventType, vars, giftID, loopCount := normalizeLiveEvent(ev)
	if eventType == "" {
		return
	}
	if eventType == "gift" {
		shouldProcess, totalRepeatCount := a.normalizeGiftCounts(ev, loopCount)
		if !shouldProcess {
			return
		}
		loopCount = totalRepeatCount
	}
	if loopCount <= 0 {
		return
	}
	if vars == nil {
		vars = map[string]string{}
	}
	// `repeat_count` is always the effective total (final combo count for grouped gifts).
	vars["repeat_count"] = strconv.Itoa(loopCount)
	rules := a.store.rulesForTrigger(eventType, giftID)
	if len(rules) == 0 {
		return
	}
	for _, rule := range rules {
		if !ruleLabelMatches(rule, vars) {
			continue
		}
		jobVars := make(map[string]string, len(vars))
		for k, v := range vars {
			jobVars[k] = v
		}
		a.enqueueTrigger(queuedMCTrigger{
			rule:         rule,
			eventType:    eventType,
			giftID:       giftID,
			vars:         jobVars,
			command:      applyCommandTemplate(rule.MCCommand, jobVars),
			runMCCommand: rule.RunMCCommand,
			shortcutKeys: applyCommandTemplate(rule.ShortcutKeys, jobVars),
			shortcutHold: rule.ShortcutHold,
			runShortcut:  rule.RunShortcut,
			queuedAt:     time.Now(),
		})
	}
}

func ruleLabelMatches(rule eventRecord, vars map[string]string) bool {
	label := strings.TrimSpace(rule.Label)
	if label == "" {
		return true
	}
	switch strings.ToLower(strings.TrimSpace(rule.Type)) {
	case "comment":
		comment := strings.ToLower(vars["comment"])
		return strings.Contains(comment, strings.ToLower(label))
	case "like":
		target, err := strconv.Atoi(label)
		if err != nil || target < 0 {
			return false
		}
		current, err := strconv.Atoi(strings.TrimSpace(vars["likes"]))
		if err != nil {
			return false
		}
		return current == target
	default:
		return true
	}
}

func (a *mcEventAutomation) shouldProcessEvent(ev any) bool {
	liveEvent, ok := ev.(gotiktoklive.Event)
	if !ok {
		return true
	}
	return !liveEvent.IsHistory()
}

func (a *mcEventAutomation) normalizeGiftCounts(ev any, fallback int) (bool, int) {
	g, ok := ev.(gotiktoklive.GiftEvent)
	if !ok {
		out := fallback
		if out <= 0 {
			out = 1
		}
		return true, out
	}

	current := g.RepeatCount
	if current <= 0 {
		if fallback > 0 {
			current = fallback
		} else {
			current = 1
		}
	}

	// Non-grouped gifts are treated as standalone events.
	if g.GroupID == 0 {
		return true, current
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	state := a.giftCombo[g.GroupID]
	// Some gift streams appear to reuse GroupID across separate combos.
	// When the repeat counter restarts (or goes backwards), treat it as a new combo
	// instead of carrying over state from the previous one.
	if state.Last > 0 && current <= state.Last {
		if current == 1 || current < state.Last {
			state = giftComboProgress{}
		}
	}
	if state.Last > 0 && current > state.Last {
		state.SawIncrease = true
	}
	if current > state.Max {
		state.Max = current
	}
	state.Sum += current
	state.Last = current
	a.giftCombo[g.GroupID] = state

	// Wait for combo end to execute once using final total repeat_count.
	if !g.RepeatEnd {
		return false, 0
	}

	total := state.Max
	if !state.SawIncrease {
		total = state.Sum
	}
	if total <= 0 {
		total = current
	}
	if total <= 0 {
		total = 1
	}
	delete(a.giftCombo, g.GroupID)
	return true, total
}

func normalizeLiveEvent(ev any) (string, map[string]string, int, int) {
	switch e := ev.(type) {
	case gotiktoklive.ChatEvent:
		username := historyUsernameFromEvent(e, e.User)
		nickname := safeNicknameFromUser(e.User)
		follow := strconv.FormatBool(isFollowerFromIdentity(e.UserIdentity, e.User))
		return "comment", map[string]string{
			"event_type": "comment",
			"username":   username,
			"nickname":   nickname,
			"follow":     follow,
			"comment":    e.Comment,
		}, 0, 1
	case gotiktoklive.LikeEvent:
		username := historyUsernameFromEvent(e, e.User)
		nickname := safeNicknameFromUser(e.User)
		follow := strconv.FormatBool(isFollowerFromIdentity(nil, e.User))
		return "like", map[string]string{
			"event_type":  "like",
			"username":    username,
			"nickname":    nickname,
			"follow":      follow,
			"likes":       strconv.Itoa(e.Likes),
			"total_likes": strconv.Itoa(e.TotalLikes),
		}, 0, 1
	case gotiktoklive.GiftEvent:
		username := historyUsernameFromEvent(e, e.User)
		nickname := safeNicknameFromUser(e.User)
		follow := strconv.FormatBool(isFollowerFromIdentity(e.UserIdentity, e.User))
		loopCount := e.RepeatCount
		if loopCount <= 0 {
			loopCount = 1
		}
		return "gift", map[string]string{
			"event_type":   "gift",
			"username":     username,
			"nickname":     nickname,
			"follow":       follow,
			"gift_name":    e.Name,
			"gift_id":      strconv.FormatInt(e.ID, 10),
			"diamond":      strconv.Itoa(e.Diamonds),
			"repeat_count": strconv.Itoa(e.RepeatCount),
		}, int(e.ID), loopCount
	case gotiktoklive.UserEvent:
		username := historyUsernameFromEvent(e, e.User)
		nickname := safeNicknameFromUser(e.User)
		follow := strconv.FormatBool(isFollowerFromIdentity(nil, e.User))
		tag := strings.ToUpper(fmt.Sprint(e.Event))
		if strings.Contains(tag, "JOIN") {
			return "join", map[string]string{
				"event_type": "join",
				"username":   username,
				"nickname":   nickname,
				"follow":     follow,
			}, 0, 1
		}
		if strings.Contains(tag, "SHARE") {
			return "share", map[string]string{
				"event_type": "share",
				"username":   username,
				"nickname":   nickname,
				"follow":     follow,
			}, 0, 1
		}
		if strings.Contains(tag, "FOLLOW") {
			return "follow", map[string]string{
				"event_type": "follow",
				"username":   username,
				"nickname":   nickname,
				"follow":     follow,
			}, 0, 1
		}
	}
	return "", nil, 0, 0
}

func isFollowerFromIdentity(identity *gotiktoklive.UserIdentity, user *gotiktoklive.User) bool {
	if identity != nil {
		return identity.IsFollower
	}
	if user != nil && user.ExtraAttributes != nil {
		return user.ExtraAttributes.FollowRole > 0
	}
	return false
}

func historyUsernameFromEvent(ev any, fallbackUser *gotiktoklive.User) string {
	b, err := json.Marshal(ev)
	if err == nil {
		var payload map[string]any
		if err := json.Unmarshal(b, &payload); err == nil {
			if rawUser, ok := payload["user"].(map[string]any); ok {
				if name := firstStringValue(rawUser["username"], rawUser["Username"]); name != "" {
					return name
				}
			}
			if rawUser, ok := payload["User"].(map[string]any); ok {
				if name := firstStringValue(rawUser["username"], rawUser["Username"]); name != "" {
					return name
				}
			}
		}
	}
	return safeUsernameFromUser(fallbackUser)
}

func firstStringValue(values ...any) string {
	for _, v := range values {
		if s, ok := v.(string); ok {
			s = strings.TrimSpace(s)
			if s != "" {
				return s
			}
		}
	}
	return ""
}

func safeUsernameFromUser(u *gotiktoklive.User) string {
	if u == nil {
		return "TestPlayer"
	}
	name := strings.TrimSpace(u.Username)
	if name == "" {
		return "TestPlayer"
	}
	return name
}

func safeNicknameFromUser(u *gotiktoklive.User) string {
	if u == nil {
		return "TestPlayer"
	}
	name := strings.TrimSpace(u.Nickname)
	if name == "" {
		name = strings.TrimSpace(u.Username)
	}
	if name == "" {
		return "TestPlayer"
	}
	return name
}

func applyCommandTemplate(command string, vars map[string]string) string {
	out := command
	for k, v := range vars {
		out = strings.ReplaceAll(out, "{"+k+"}", v)
	}
	return out
}

type shortcutKeySpec struct {
	vk         uint16
	needsShift bool
}

func parseShortcutKeyToken(token string) (shortcutKeySpec, error) {
	t := strings.TrimSpace(strings.ToLower(token))
	switch t {
	case "enter", "return":
		return shortcutKeySpec{vk: 0x0D}, nil
	case "tab":
		return shortcutKeySpec{vk: 0x09}, nil
	case "esc", "escape":
		return shortcutKeySpec{vk: 0x1B}, nil
	case "space", "spacebar":
		return shortcutKeySpec{vk: 0x20}, nil
	case "backspace":
		return shortcutKeySpec{vk: 0x08}, nil
	case "delete", "del":
		return shortcutKeySpec{vk: 0x2E}, nil
	case "insert", "ins":
		return shortcutKeySpec{vk: 0x2D}, nil
	case "home":
		return shortcutKeySpec{vk: 0x24}, nil
	case "end":
		return shortcutKeySpec{vk: 0x23}, nil
	case "pageup", "pgup":
		return shortcutKeySpec{vk: 0x21}, nil
	case "pagedown", "pgdn":
		return shortcutKeySpec{vk: 0x22}, nil
	case "up", "arrowup":
		return shortcutKeySpec{vk: 0x26}, nil
	case "down", "arrowdown":
		return shortcutKeySpec{vk: 0x28}, nil
	case "left", "arrowleft":
		return shortcutKeySpec{vk: 0x25}, nil
	case "right", "arrowright":
		return shortcutKeySpec{vk: 0x27}, nil
	case "capslock":
		return shortcutKeySpec{vk: 0x14}, nil
	case "numlock":
		return shortcutKeySpec{vk: 0x90}, nil
	case "scrolllock":
		return shortcutKeySpec{vk: 0x91}, nil
	case "printscreen", "prtsc":
		return shortcutKeySpec{vk: 0x2C}, nil
	case "pause", "break":
		return shortcutKeySpec{vk: 0x13}, nil
	case "dot", "period":
		return shortcutKeySpec{vk: 0xBE}, nil
	case ".":
		return shortcutKeySpec{vk: 0xBE}, nil
	case "comma":
		return shortcutKeySpec{vk: 0xBC}, nil
	case ",":
		return shortcutKeySpec{vk: 0xBC}, nil
	case "slash", "forwardslash":
		return shortcutKeySpec{vk: 0xBF}, nil
	case "/":
		return shortcutKeySpec{vk: 0xBF}, nil
	case "backslash":
		return shortcutKeySpec{vk: 0xDC}, nil
	case `\`:
		return shortcutKeySpec{vk: 0xDC}, nil
	case "minus", "dash", "hyphen":
		return shortcutKeySpec{vk: 0xBD}, nil
	case "-":
		return shortcutKeySpec{vk: 0xBD}, nil
	case "equal", "equals":
		return shortcutKeySpec{vk: 0xBB}, nil
	case "=":
		return shortcutKeySpec{vk: 0xBB}, nil
	case "semicolon":
		return shortcutKeySpec{vk: 0xBA}, nil
	case ";":
		return shortcutKeySpec{vk: 0xBA}, nil
	case "quote", "apostrophe":
		return shortcutKeySpec{vk: 0xDE}, nil
	case "'":
		return shortcutKeySpec{vk: 0xDE}, nil
	case "backtick", "grave":
		return shortcutKeySpec{vk: 0xC0}, nil
	case "`":
		return shortcutKeySpec{vk: 0xC0}, nil
	case "openbracket", "lbracket":
		return shortcutKeySpec{vk: 0xDB}, nil
	case "[":
		return shortcutKeySpec{vk: 0xDB}, nil
	case "closebracket", "rbracket":
		return shortcutKeySpec{vk: 0xDD}, nil
	case "]":
		return shortcutKeySpec{vk: 0xDD}, nil
	case "question":
		return shortcutKeySpec{vk: 0xBF, needsShift: true}, nil
	case "?":
		return shortcutKeySpec{vk: 0xBF, needsShift: true}, nil
	case "exclamation":
		return shortcutKeySpec{vk: 0x31, needsShift: true}, nil
	case "!":
		return shortcutKeySpec{vk: 0x31, needsShift: true}, nil
	case "at":
		return shortcutKeySpec{vk: 0x32, needsShift: true}, nil
	case "@":
		return shortcutKeySpec{vk: 0x32, needsShift: true}, nil
	case "hash":
		return shortcutKeySpec{vk: 0x33, needsShift: true}, nil
	case "#":
		return shortcutKeySpec{vk: 0x33, needsShift: true}, nil
	case "dollar":
		return shortcutKeySpec{vk: 0x34, needsShift: true}, nil
	case "$":
		return shortcutKeySpec{vk: 0x34, needsShift: true}, nil
	case "percent", "%":
		return shortcutKeySpec{vk: 0x35, needsShift: true}, nil
	case "caret", "^":
		return shortcutKeySpec{vk: 0x36, needsShift: true}, nil
	case "ampersand":
		return shortcutKeySpec{vk: 0x37, needsShift: true}, nil
	case "&":
		return shortcutKeySpec{vk: 0x37, needsShift: true}, nil
	case "asterisk":
		return shortcutKeySpec{vk: 0x38, needsShift: true}, nil
	case "*":
		return shortcutKeySpec{vk: 0x38, needsShift: true}, nil
	case "openparen", "(":
		return shortcutKeySpec{vk: 0x39, needsShift: true}, nil
	case "closeparen", ")":
		return shortcutKeySpec{vk: 0x30, needsShift: true}, nil
	case "underscore":
		return shortcutKeySpec{vk: 0xBD, needsShift: true}, nil
	case "_":
		return shortcutKeySpec{vk: 0xBD, needsShift: true}, nil
	case "colon":
		return shortcutKeySpec{vk: 0xBA, needsShift: true}, nil
	case ":":
		return shortcutKeySpec{vk: 0xBA, needsShift: true}, nil
	case "doublequote":
		return shortcutKeySpec{vk: 0xDE, needsShift: true}, nil
	case `"`:
		return shortcutKeySpec{vk: 0xDE, needsShift: true}, nil
	case "less":
		return shortcutKeySpec{vk: 0xBC, needsShift: true}, nil
	case "<":
		return shortcutKeySpec{vk: 0xBC, needsShift: true}, nil
	case "greater":
		return shortcutKeySpec{vk: 0xBE, needsShift: true}, nil
	case ">":
		return shortcutKeySpec{vk: 0xBE, needsShift: true}, nil
	}
	if strings.HasPrefix(t, "f") && len(t) >= 2 {
		if n, err := strconv.Atoi(t[1:]); err == nil && n >= 1 && n <= 12 {
			return shortcutKeySpec{vk: uint16(0x70 + n - 1)}, nil
		}
	}
	if len(t) == 1 {
		ch := t[0]
		if ch >= 'a' && ch <= 'z' {
			return shortcutKeySpec{vk: uint16(ch - 'a' + 'A')}, nil
		}
		if ch >= '0' && ch <= '9' {
			return shortcutKeySpec{vk: uint16(ch)}, nil
		}
	}
	return shortcutKeySpec{}, fmt.Errorf("unsupported key token: %s", token)
}

func parseShortcutToVK(shortcut string) ([]uint16, shortcutKeySpec, error) {
	parts := strings.Split(shortcut, "+")
	if len(parts) == 0 {
		return nil, shortcutKeySpec{}, fmt.Errorf("shortcut is empty")
	}
	modCtrl := false
	modAlt := false
	modShift := false
	mainKey := shortcutKeySpec{}
	mainSet := false
	for _, raw := range parts {
		p := strings.TrimSpace(strings.ToLower(raw))
		if p == "" {
			continue
		}
		switch p {
		case "ctrl", "control":
			modCtrl = true
		case "alt":
			modAlt = true
		case "shift":
			modShift = true
		case "win", "windows", "meta", "cmd":
			return nil, shortcutKeySpec{}, fmt.Errorf("windows/meta key is not supported")
		default:
			if mainSet {
				return nil, shortcutKeySpec{}, fmt.Errorf("shortcut must have exactly one main key")
			}
			parsed, err := parseShortcutKeyToken(p)
			if err != nil {
				return nil, shortcutKeySpec{}, err
			}
			mainKey = parsed
			mainSet = true
		}
	}
	if !mainSet {
		return nil, shortcutKeySpec{}, fmt.Errorf("shortcut must include a main key")
	}
	modifiers := make([]uint16, 0, 3)
	if modCtrl {
		modifiers = append(modifiers, 0x11) // VK_CONTROL
	}
	if modAlt {
		modifiers = append(modifiers, 0x12) // VK_MENU (ALT)
	}
	if modShift {
		modifiers = append(modifiers, 0x10) // VK_SHIFT
	}
	return modifiers, mainKey, nil
}

func executeKeyboardShortcut(shortcut string, holdMS int) error {
	shortcut = strings.TrimSpace(shortcut)
	if shortcut == "" {
		return fmt.Errorf("shortcut is empty")
	}
	if holdMS < 0 {
		holdMS = 0
	}
	if holdMS > 10000 {
		holdMS = 10000
	}
	if runtime.GOOS != "windows" {
		return fmt.Errorf("keyboard shortcut is only supported on Windows")
	}
	modifiers, mainKey, err := parseShortcutToVK(shortcut)
	if err != nil {
		return err
	}

	type keyboardInput struct {
		Vk        uint16
		Scan      uint16
		Flags     uint32
		Time      uint32
		ExtraInfo uintptr
	}
	type input struct {
		Type    uint32
		_       uint32
		Ki      keyboardInput
		Padding [8]byte
	}

	const (
		inputKeyboard  = 1
		keyeventfKeyUp = 0x0002
		vkShift        = 0x10
	)

	makeKeyInput := func(vk uint16, keyUp bool) input {
		flags := uint32(0)
		if keyUp {
			flags = keyeventfKeyUp
		}
		return input{
			Type: inputKeyboard,
			Ki: keyboardInput{
				Vk:    vk,
				Flags: flags,
			},
		}
	}

	effectiveModifiers := make([]uint16, 0, len(modifiers)+1)
	effectiveModifiers = append(effectiveModifiers, modifiers...)
	hasShiftModifier := false
	for _, vk := range modifiers {
		if vk == vkShift {
			hasShiftModifier = true
			break
		}
	}
	if mainKey.needsShift && !hasShiftModifier {
		effectiveModifiers = append(effectiveModifiers, vkShift)
	}

	user32 := syscall.NewLazyDLL("user32.dll")
	sendInput := user32.NewProc("SendInput")

	send := func(inputs []input) error {
		if len(inputs) == 0 {
			return nil
		}
		ret, _, callErr := sendInput.Call(
			uintptr(len(inputs)),
			uintptr(unsafe.Pointer(&inputs[0])),
			unsafe.Sizeof(input{}),
		)
		if int(ret) != len(inputs) {
			if callErr != syscall.Errno(0) {
				return fmt.Errorf("sendinput failed: %v", callErr)
			}
			return fmt.Errorf("sendinput failed: sent %d of %d input events", int(ret), len(inputs))
		}
		return nil
	}

	downModifiers := make([]input, 0, len(effectiveModifiers))
	for _, vk := range effectiveModifiers {
		downModifiers = append(downModifiers, makeKeyInput(vk, false))
	}
	if err := send(downModifiers); err != nil {
		return err
	}
	if err := send([]input{makeKeyInput(mainKey.vk, false)}); err != nil {
		return err
	}
	if holdMS > 0 {
		time.Sleep(time.Duration(holdMS) * time.Millisecond)
	}
	if err := send([]input{makeKeyInput(mainKey.vk, true)}); err != nil {
		return err
	}
	upModifiers := make([]input, 0, len(effectiveModifiers))
	for i := len(effectiveModifiers) - 1; i >= 0; i-- {
		upModifiers = append(upModifiers, makeKeyInput(effectiveModifiers[i], true))
	}
	if err := send(upModifiers); err != nil {
		return err
	}

	return nil
}

func splitCommands(raw string) []string {
	raw = strings.ReplaceAll(raw, "\r\n", "\n")
	raw = strings.ReplaceAll(raw, "\r", "\n")
	lines := strings.Split(raw, "\n")
	out := make([]string, 0, len(lines))
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		if strings.HasPrefix(line, "/") {
			line = strings.TrimSpace(strings.TrimPrefix(line, "/"))
		}
		if line == "" {
			continue
		}
		out = append(out, line)
	}
	return out
}

func executeCommands(rcon *mcRCONManager, raw string) (string, error) {
	commands := splitCommands(raw)
	if len(commands) == 0 {
		return "", fmt.Errorf("command is empty")
	}

	outputs := make([]string, 0, len(commands))
	for i, command := range commands {
		out, err := rcon.Execute(command)
		if err != nil {
			if len(outputs) > 0 {
				return strings.Join(outputs, "\n\n"), err
			}
			return "", err
		}
		out = strings.TrimSpace(out)
		if out == "" {
			out = "(ok)"
		}
		outputs = append(outputs, fmt.Sprintf("[%d/%d] %s\n%s", i+1, len(commands), command, out))
		if i < len(commands)-1 {
			time.Sleep(75 * time.Millisecond)
		}
	}
	return strings.Join(outputs, "\n\n"), nil
}

func main() {
	initAppPaths()

	hub := newEventHub()
	store, err := newEventStore(appEventsPath)
	if err != nil {
		log.Fatalf("failed to init event store: %v", err)
	}
	usernameAllowlist := newGithubUsernameAllowlist(defaultUsernameAllowlistURL, 30*time.Second)
	mcRCON := newMCRCONManagerFromProperties(filepath.Join("Server", "server.properties"))
	autoMC := newMCEventAutomation(store, mcRCON, hub)
	ctrl := newStreamController(hub, autoMC.HandleLiveEvent)

	embeddedStatic, err := fs.Sub(embeddedWebFS, "web/static")
	if err != nil {
		log.Fatalf("failed to load embedded static assets: %v", err)
	}
	staticFS := http.FileServer(http.FS(embeddedStatic))
	if err := os.MkdirAll(appSoundsDir, 0755); err != nil {
		log.Fatalf("failed to init sound directory: %v", err)
	}
	soundsFS := http.FileServer(http.Dir(appSoundsDir))
	http.Handle("/static/sounds/", http.StripPrefix("/static/sounds/", soundsFS))
	http.Handle("/static/", http.StripPrefix("/static/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(strings.ToLower(r.URL.Path), ".css") {
			w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
		}
		staticFS.ServeHTTP(w, r)
	})))
	giftImageFS := http.FileServer(http.Dir(appGiftImage))
	http.Handle("/giftimage/", http.StripPrefix("/giftimage/", giftImageFS))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		b, readErr := embeddedWebFS.ReadFile("web/index.html")
		if readErr != nil {
			http.Error(w, "failed to load page", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write(b)
	})

	http.HandleFunc("/state", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		running, username := ctrl.State()
		writeJSON(w, http.StatusOK, map[string]any{
			"running":  running,
			"username": username,
		})
	})

	http.HandleFunc("/start", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Username string `json:"username"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
			return
		}
		allowed, allowErr := usernameAllowlist.isAllowed(req.Username)
		if allowErr != nil {
			_ = allowErr
			writeJSON(w, http.StatusForbidden, map[string]any{
				"error": "You have not purchased a license. Contact +6285156560055",
			})
			return
		}
		if !allowed {
			writeJSON(w, http.StatusForbidden, map[string]any{
				"error": "You have not purchased a license. Contact +6285156560055",
			})
			return
		}
		if err := ctrl.Start(req.Username); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"ok": true})
	})

	http.HandleFunc("/stop", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		ctrl.Stop()
		writeJSON(w, http.StatusOK, map[string]any{"ok": true})
	})

	http.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "stream unsupported", http.StatusInternalServerError)
			return
		}

		ch := hub.subscribe()
		defer hub.unsubscribe(ch)

		running, username := ctrl.State()
		message := "Idle (not connected)"
		if running {
			message = "Tracking @" + username
		}
		fmt.Fprintf(w, "data: %s\n\n", mustJSON(map[string]any{
			"type":    "status",
			"message": message,
			"time":    time.Now().Format(time.RFC3339),
		}))
		flusher.Flush()

		keepAlive := time.NewTicker(20 * time.Second)
		defer keepAlive.Stop()

		for {
			select {
			case <-r.Context().Done():
				return
			case msg := <-ch:
				fmt.Fprintf(w, "data: %s\n\n", msg)
				flusher.Flush()
			case <-keepAlive.C:
				fmt.Fprint(w, ": ping\n\n")
				flusher.Flush()
			}
		}
	})

	http.HandleFunc("/api/events", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			items := store.list()
			sort.Slice(items, func(i, j int) bool { return items[i].ID > items[j].ID })
			writeJSON(w, http.StatusOK, map[string]any{"items": items})
		case http.MethodPost:
			var req struct {
				Type         string `json:"type"`
				Title        string `json:"title"`
				Label        string `json:"label"`
				GiftID       int    `json:"gift_id"`
				SoundURL     string `json:"sound_url"`
				MCCommand    string `json:"mc_command"`
				RunMCCommand *bool  `json:"run_mc_command"`
				RunShortcut  *bool  `json:"run_shortcut"`
				ShortcutKeys string `json:"shortcut_keys"`
				ShortcutHold int    `json:"shortcut_hold_ms"`
			}
			if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
				return
			}
			req.Type = strings.TrimSpace(strings.ToLower(req.Type))
			if !isAllowedEventType(req.Type) {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "type must be one of: join/comment/like/gift/share"})
				return
			}
			req.Title = strings.TrimSpace(req.Title)
			req.Label = strings.TrimSpace(req.Label)
			if req.Type == "like" && req.Label != "" {
				n, err := strconv.Atoi(req.Label)
				if err != nil || n < 0 {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "like label must be a number >= 0"})
					return
				}
			}
			runMCCommand := true
			if req.RunMCCommand != nil {
				runMCCommand = *req.RunMCCommand
			}
			runShortcut := false
			if req.RunShortcut != nil {
				runShortcut = *req.RunShortcut
			}
			shortcutKeys := strings.TrimSpace(req.ShortcutKeys)
			if runShortcut && shortcutKeys == "" {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "shortcut_keys is required when run_shortcut=true"})
				return
			}
			if req.ShortcutHold < 0 || req.ShortcutHold > 10000 {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "shortcut_hold_ms must be between 0 and 10000"})
				return
			}
			if !runShortcut {
				shortcutKeys = ""
			}
			if !runMCCommand && !runShortcut {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "at least one action must be enabled"})
				return
			}
			if runMCCommand && strings.TrimSpace(req.MCCommand) == "" {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "mc_command is required when run_mc_command=true"})
				return
			}
			req.SoundURL = strings.TrimSpace(req.SoundURL)
			giftID := 0
			giftName := ""
			diamond := 0
			if req.Type == "gift" {
				gifts, err := loadGiftListJSON(appGiftList)
				if err != nil {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift list: " + err.Error()})
					return
				}
				gift, ok := findGiftByID(gifts, req.GiftID)
				if !ok {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "gift_id not found in gift list"})
					return
				}
				giftID = gift.ID
				giftName = gift.NamaGift
				diamond = gift.Diamond
			}
			item, err := store.create(req.Type, req.Title, req.Label, giftID, giftName, diamond, req.SoundURL, req.MCCommand, runMCCommand, runShortcut, shortcutKeys, req.ShortcutHold)
			if err != nil {
				writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
				return
			}
			writeJSON(w, http.StatusCreated, map[string]any{"item": item})
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/events/", func(w http.ResponseWriter, r *http.Request) {
		id, err := parseIDFromPath(r.URL.Path, "/api/events/")
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error()})
			return
		}
		switch r.Method {
		case http.MethodPut:
			var req struct {
				Type         string `json:"type"`
				Title        string `json:"title"`
				Label        string `json:"label"`
				GiftID       int    `json:"gift_id"`
				SoundURL     string `json:"sound_url"`
				MCCommand    string `json:"mc_command"`
				RunMCCommand *bool  `json:"run_mc_command"`
				RunShortcut  *bool  `json:"run_shortcut"`
				ShortcutKeys string `json:"shortcut_keys"`
				ShortcutHold int    `json:"shortcut_hold_ms"`
			}
			if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
				return
			}
			req.Type = strings.TrimSpace(strings.ToLower(req.Type))
			if !isAllowedEventType(req.Type) {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "type must be one of: join/comment/like/gift/share"})
				return
			}
			req.Title = strings.TrimSpace(req.Title)
			req.Label = strings.TrimSpace(req.Label)
			if req.Type == "like" && req.Label != "" {
				n, err := strconv.Atoi(req.Label)
				if err != nil || n < 0 {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "like label must be a number >= 0"})
					return
				}
			}
			runMCCommand := true
			if req.RunMCCommand != nil {
				runMCCommand = *req.RunMCCommand
			}
			runShortcut := false
			if req.RunShortcut != nil {
				runShortcut = *req.RunShortcut
			}
			shortcutKeys := strings.TrimSpace(req.ShortcutKeys)
			if runShortcut && shortcutKeys == "" {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "shortcut_keys is required when run_shortcut=true"})
				return
			}
			if req.ShortcutHold < 0 || req.ShortcutHold > 10000 {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "shortcut_hold_ms must be between 0 and 10000"})
				return
			}
			if !runShortcut {
				shortcutKeys = ""
			}
			if !runMCCommand && !runShortcut {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "at least one action must be enabled"})
				return
			}
			if runMCCommand && strings.TrimSpace(req.MCCommand) == "" {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "mc_command is required when run_mc_command=true"})
				return
			}
			req.SoundURL = strings.TrimSpace(req.SoundURL)
			giftID := 0
			giftName := ""
			diamond := 0
			if req.Type == "gift" {
				gifts, err := loadGiftListJSON(appGiftList)
				if err != nil {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift list: " + err.Error()})
					return
				}
				gift, ok := findGiftByID(gifts, req.GiftID)
				if !ok {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "gift_id not found in gift list"})
					return
				}
				giftID = gift.ID
				giftName = gift.NamaGift
				diamond = gift.Diamond
			}
			item, err := store.update(id, req.Type, req.Title, req.Label, giftID, giftName, diamond, req.SoundURL, req.MCCommand, runMCCommand, runShortcut, shortcutKeys, req.ShortcutHold)
			if err != nil {
				writeJSON(w, http.StatusNotFound, map[string]any{"error": err.Error()})
				return
			}
			writeJSON(w, http.StatusOK, map[string]any{"item": item})
		case http.MethodDelete:
			if err := store.delete(id); err != nil {
				writeJSON(w, http.StatusNotFound, map[string]any{"error": err.Error()})
				return
			}
			writeJSON(w, http.StatusOK, map[string]any{"ok": true})
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/events/export", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		items := store.list()
		sort.Slice(items, func(i, j int) bool { return items[i].ID < items[j].ID })

		payload := map[string]any{"items": items}
		b, err := json.MarshalIndent(payload, "", "  ")
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to build export json"})
			return
		}

		fileName := "events-" + time.Now().Format("20060102-150405") + ".json"
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(b)
	})

	http.HandleFunc("/api/events/load", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var body []byte
		contentType := strings.ToLower(strings.TrimSpace(r.Header.Get("Content-Type")))
		if strings.Contains(contentType, "multipart/form-data") {
			r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
			if err := r.ParseMultipartForm(10 << 20); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid upload payload"})
				return
			}
			file, _, err := r.FormFile("file")
			if err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "event json file is required"})
				return
			}
			defer file.Close()
			readBody, err := io.ReadAll(file)
			if err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read event file"})
				return
			}
			body = readBody
		} else {
			readBody, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 10<<20))
			if err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
				return
			}
			body = readBody
		}

		parsed, err := parseEventRecordsPayload(body)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error()})
			return
		}
		normalized, err := normalizeImportedEvents(parsed)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error()})
			return
		}
		if err := store.replaceAll(normalized); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to save imported events"})
			return
		}

		hub.broadcast(mustJSON(map[string]any{
			"type":    "status",
			"message": fmt.Sprintf("Loaded %d event(s) from JSON", len(normalized)),
			"time":    time.Now().Format(time.RFC3339),
		}))
		writeJSON(w, http.StatusOK, map[string]any{"ok": true, "count": len(normalized)})
	})

	http.HandleFunc("/api/events/reset", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		if err := store.resetAll(); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to reset events"})
			return
		}
		hub.broadcast(mustJSON(map[string]any{
			"type":    "status",
			"message": "events.json has been reset",
			"time":    time.Now().Format(time.RFC3339),
		}))
		writeJSON(w, http.StatusOK, map[string]any{"ok": true})
	})

	http.HandleFunc("/api/gifts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		items, err := loadGiftListJSON(appGiftList)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift list: " + err.Error()})
			return
		}
		sort.Slice(items, func(i, j int) bool {
			if items[i].Diamond == items[j].Diamond {
				if items[i].NamaGift == items[j].NamaGift {
					return items[i].ID < items[j].ID
				}
				return items[i].NamaGift < items[j].NamaGift
			}
			return items[i].Diamond < items[j].Diamond
		})
		writeJSON(w, http.StatusOK, map[string]any{"items": items})
	})

	http.HandleFunc("/api/gifts/refresh", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Username string `json:"username"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
			return
		}
		username := strings.TrimSpace(strings.TrimPrefix(req.Username, "@"))
		if username == "" {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "username is required"})
			return
		}

		gifts, roomID, region, source, err := fetchGiftCatalogFromUsername(username)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error()})
			return
		}

		downloadedCount, downloadErrs := downloadGiftImages(appGiftImage, gifts)
		if len(downloadErrs) > 0 {
			hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": fmt.Sprintf("gift image download completed with %d error(s): %s", len(downloadErrs), strings.Join(downloadErrs[:min(len(downloadErrs), 3)], "; ")),
				"time":  time.Now().Format(time.RFC3339),
			}))
		}

		outFile, saveErr := saveGiftListJSON(appGiftList, username, gifts)
		if saveErr != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to save gift list json: " + saveErr.Error()})
			return
		}

		hub.broadcast(mustJSON(map[string]any{
			"type":    "status",
			"message": fmt.Sprintf("Gift list refreshed for @%s (region: %s, source: %s), saved to %s and downloaded %d gift image(s) to %s", username, fallbackRegion(region), source, outFile, downloadedCount, appGiftImage),
			"time":    time.Now().Format(time.RFC3339),
		}))
		hub.broadcast(mustJSON(map[string]any{
			"type":     "gift_catalog",
			"username": username,
			"roomID":   roomID,
			"region":   region,
			"source":   source,
			"count":    len(gifts),
			"gifts":    gifts,
			"time":     time.Now().Format(time.RFC3339),
		}))

		writeJSON(w, http.StatusOK, map[string]any{
			"ok":                true,
			"username":          username,
			"room_id":           roomID,
			"region":            region,
			"source":            source,
			"count":             len(gifts),
			"gift_list_path":    outFile,
			"downloaded_images": downloadedCount,
		})
	})

	http.HandleFunc("/api/upload/sound", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		r.Body = http.MaxBytesReader(w, r.Body, 20<<20)
		if err := r.ParseMultipartForm(20 << 20); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid upload payload"})
			return
		}

		file, header, err := r.FormFile("file")
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "sound file is required"})
			return
		}
		defer file.Close()

		fileName := sanitizeUploadFilename(header.Filename)
		ext := strings.ToLower(filepath.Ext(fileName))
		if !isAllowedAudioExt(ext) {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "unsupported sound format"})
			return
		}

		soundsDir := appSoundsDir
		if err := os.MkdirAll(soundsDir, 0755); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to create sound directory"})
			return
		}

		targetName := fileName
		targetPath := filepath.Join(soundsDir, targetName)

		dst, err := os.Create(targetPath)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to save sound file"})
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to write sound file"})
			return
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"ok":        true,
			"sound_url": "/static/sounds/" + targetName,
			"file_name": targetName,
		})
	})

	http.HandleFunc("/api/minecraft/rcon/status", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		writeJSON(w, http.StatusOK, mcRCON.Status())
	})

	http.HandleFunc("/api/minecraft/rcon/connect", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Host     string `json:"host"`
			Port     int    `json:"port"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
			return
		}
		if err := mcRCON.Connect(req.Host, req.Port, req.Password); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error(), "status": mcRCON.Status()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"ok": true, "status": mcRCON.Status()})
	})

	http.HandleFunc("/api/minecraft/rcon/disconnect", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		mcRCON.Disconnect()
		writeJSON(w, http.StatusOK, map[string]any{"ok": true, "status": mcRCON.Status()})
	})

	http.HandleFunc("/api/minecraft/rcon/command", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Command string `json:"command"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
			return
		}
		out, err := executeCommands(mcRCON, req.Command)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error(), "status": mcRCON.Status()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"output": out, "status": mcRCON.Status()})
	})

	http.HandleFunc("/api/events/test/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		id, err := parseIDFromPath(r.URL.Path, "/api/events/test/")
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error()})
			return
		}
		item, ok := store.getByID(id)
		if !ok {
			writeJSON(w, http.StatusNotFound, map[string]any{"error": "event not found"})
			return
		}
		cmd := applyCommandTemplate(item.MCCommand, map[string]string{
			"event_type":   "test",
			"username":     "TestPlayer",
			"nickname":     "Test Player",
			"comment":      "test comment",
			"gift_name":    item.GiftName,
			"gift_id":      strconv.Itoa(item.GiftID),
			"diamond":      strconv.Itoa(item.Diamond),
			"repeat_count": "1",
		})
		shortcut := applyCommandTemplate(item.ShortcutKeys, map[string]string{
			"event_type":   "test",
			"username":     "TestPlayer",
			"nickname":     "Test Player",
			"comment":      "test comment",
			"gift_name":    item.GiftName,
			"gift_id":      strconv.Itoa(item.GiftID),
			"diamond":      strconv.Itoa(item.Diamond),
			"repeat_count": "1",
		})
		out := ""
		var cmdErr error
		if item.RunMCCommand {
			out, cmdErr = executeCommands(mcRCON, cmd)
		}
		var shortcutErr error
		if item.RunShortcut {
			shortcutErr = executeKeyboardShortcut(shortcut, item.ShortcutHold)
		}
		if cmdErr != nil || shortcutErr != nil {
			errText := ""
			if cmdErr != nil {
				errText = cmdErr.Error()
			}
			if shortcutErr != nil {
				if errText != "" {
					errText += "; "
				}
				errText += shortcutErr.Error()
			}
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": errText, "status": mcRCON.Status()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"ok":               true,
			"eventId":          id,
			"command":          cmd,
			"run_mc_command":   item.RunMCCommand,
			"run_shortcut":     item.RunShortcut,
			"shortcut_keys":    shortcut,
			"shortcut_hold_ms": item.ShortcutHold,
			"output":           out,
			"status":           mcRCON.Status(),
		})
	})

	testEventHandler := func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Type        string `json:"type"`
			Username    string `json:"username"`
			GiftID      int    `json:"gift_id"`
			RepeatCount int    `json:"repeat_count"`
			Text        string `json:"text"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request body"})
			return
		}

		eventType := strings.TrimSpace(strings.ToLower(req.Type))
		if eventType == "" {
			eventType = "gift"
		}

		username := strings.TrimSpace(req.Username)
		if username == "" {
			username = "TestPlayer"
		}
		if req.RepeatCount <= 0 {
			req.RepeatCount = 1
		}

		now := time.Now().Unix()
		user := &gotiktoklive.User{Username: username, Nickname: username}
		identity := &gotiktoklive.UserIdentity{IsFollower: true}
		text := strings.TrimSpace(req.Text)
		if text == "" {
			text = "sample text"
		}

		var ev any
		resp := map[string]any{
			"ok":       true,
			"type":     eventType,
			"username": username,
		}

		switch eventType {
		case "gift":
			gifts, err := loadGiftListJSON(appGiftList)
			if err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift list: " + err.Error()})
				return
			}
			gift, ok := findGiftByID(gifts, req.GiftID)
			if !ok {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "gift_id not found in gift list"})
				return
			}
			ev = gotiktoklive.GiftEvent{
				Timestamp:    now,
				ID:           int64(gift.ID),
				Name:         gift.NamaGift,
				Diamonds:     gift.Diamond,
				RepeatCount:  req.RepeatCount,
				RepeatEnd:    true,
				User:         user,
				UserIdentity: identity,
				GroupID:      int64(time.Now().UnixNano()),
			}
			resp["gift_id"] = gift.ID
			resp["gift_name"] = gift.NamaGift
			resp["repeat_count"] = req.RepeatCount
			resp["message"] = gift.NamaGift
		case "chat":
			ev = gotiktoklive.ChatEvent{
				Timestamp:    now,
				Comment:      text,
				User:         user,
				UserIdentity: identity,
			}
			resp["message"] = text
		case "user_join":
			ev = gotiktoklive.UserEvent{
				Timestamp: now,
				Event:     gotiktoklive.USER_JOIN,
				User:      user,
			}
			resp["message"] = "JOIN"
		case "user_share":
			ev = gotiktoklive.UserEvent{
				Timestamp: now,
				Event:     gotiktoklive.USER_SHARE,
				User:      user,
			}
			resp["message"] = "SHARE"
		case "user_follow":
			ev = gotiktoklive.UserEvent{
				Timestamp: now,
				Event:     gotiktoklive.USER_FOLLOW,
				User:      user,
			}
			resp["message"] = "FOLLOW"
		case "like":
			ev = gotiktoklive.LikeEvent{
				Timestamp:  now,
				Likes:      req.RepeatCount,
				TotalLikes: req.RepeatCount,
				User:       user,
			}
			resp["message"] = fmt.Sprintf("%d likes", req.RepeatCount)
		case "room":
			ev = gotiktoklive.RoomEvent{
				Timestamp: now,
				Type:      "RoomEvent",
				Message:   text,
			}
			resp["message"] = text
		case "viewers":
			ev = gotiktoklive.ViewersEvent{
				Timestamp: now,
				Viewers:   req.RepeatCount,
			}
			resp["message"] = fmt.Sprintf("%d viewers", req.RepeatCount)
		case "question":
			ev = gotiktoklive.QuestionEvent{
				Timestamp: now,
				Quesion:   text,
				User:      user,
			}
			resp["message"] = text
		case "control":
			ev = gotiktoklive.ControlEvent{
				Timestamp:   now,
				Action:      req.RepeatCount,
				Description: text,
			}
			resp["message"] = text
		case "mic_battle":
			ev = gotiktoklive.MicBattleEvent{
				Timestamp: now,
				Users:     []*gotiktoklive.User{user},
			}
			resp["message"] = "mic battle"
		case "battles":
			ev = gotiktoklive.BattlesEvent{
				Timestamp: now,
				Status:    1,
				Battles:   []*gotiktoklive.Battle{},
			}
			resp["message"] = "battles"
		case "room_banner":
			ev = gotiktoklive.RoomBannerEvent{
				Timestamp: now,
				Data: map[string]any{
					"text": text,
				},
			}
			resp["message"] = text
		case "intro":
			ev = gotiktoklive.IntroEvent{
				Timestamp: now,
				Title:     text,
				User:      user,
			}
			resp["message"] = text
		default:
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "unsupported test event type"})
			return
		}

		hub.broadcast(mustJSON(map[string]any{
			"type":      "event",
			"eventType": fmt.Sprintf("%T", ev),
			"data":      ev,
			"time":      time.Now().Format(time.RFC3339),
		}))

		autoMC.HandleLiveEvent(ev)
		writeJSON(w, http.StatusOK, resp)
	}

	http.HandleFunc("/api/test/event", testEventHandler)
	http.HandleFunc("/api/test/gift", testEventHandler)

	listener, webURL, err := listenAutoPort()
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Web ready at %s", webURL)
	go func() {
		time.Sleep(200 * time.Millisecond)
		if err := openBrowser(webURL); err != nil {
			log.Printf("failed to open browser: %v", err)
		}
	}()
	if err := http.Serve(listener, nil); err != nil {
		log.Fatal(err)
	}
}

func listenAutoPort() (net.Listener, string, error) {
	const host = "127.0.0.1"
	const preferredPort = 8080

	primaryAddr := net.JoinHostPort(host, strconv.Itoa(preferredPort))
	ln, err := net.Listen("tcp", primaryAddr)
	if err != nil {
		ln, err = net.Listen("tcp", net.JoinHostPort(host, "0"))
		if err != nil {
			return nil, "", fmt.Errorf("failed to bind web listener: %w", err)
		}
	}
	actualAddr := ln.Addr().String()
	return ln, "http://" + actualAddr, nil
}

func openBrowser(targetURL string) error {
	targetURL = strings.TrimSpace(targetURL)
	if targetURL == "" {
		return fmt.Errorf("empty url")
	}
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", "", targetURL)
	case "darwin":
		cmd = exec.Command("open", targetURL)
	default:
		cmd = exec.Command("xdg-open", targetURL)
	}
	return cmd.Start()
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func initAppPaths() {
	cwd, _ := os.Getwd()
	cwd = strings.TrimSpace(cwd)

	exeDir := ""
	if base, err := os.Executable(); err == nil && strings.TrimSpace(base) != "" {
		exeDir = strings.TrimSpace(filepath.Dir(base))
	}

	appEventsPath = resolveAppPath("events.json", false, cwd, exeDir)
	appGiftList = resolveAppPath("gift-list.json", false, cwd, exeDir)
	appGiftImage = resolveAppPath("giftimage", true, cwd, exeDir)
	appSoundsDir = resolveAppPath("sounds", true, cwd, exeDir)

	appBaseDir = strings.TrimSpace(filepath.Dir(appEventsPath))
	if appBaseDir == "" || appBaseDir == "." {
		if cwd != "" {
			appBaseDir = cwd
		} else if exeDir != "" {
			appBaseDir = exeDir
		} else {
			appBaseDir = "."
		}
	}
}

func resolveAppPath(name string, wantDir bool, roots ...string) string {
	cleanName := strings.TrimSpace(name)
	if cleanName == "" {
		return "."
	}

	seen := make(map[string]struct{}, len(roots))
	orderedRoots := make([]string, 0, len(roots))
	for _, root := range roots {
		root = strings.TrimSpace(root)
		if root == "" {
			continue
		}
		if _, ok := seen[root]; ok {
			continue
		}
		seen[root] = struct{}{}
		orderedRoots = append(orderedRoots, root)
	}
	if len(orderedRoots) == 0 {
		orderedRoots = append(orderedRoots, ".")
	}

	for _, root := range orderedRoots {
		candidate := filepath.Join(root, cleanName)
		info, err := os.Stat(candidate)
		if err != nil {
			continue
		}
		if wantDir && info.IsDir() {
			return candidate
		}
		if !wantDir && !info.IsDir() {
			return candidate
		}
	}

	return filepath.Join(orderedRoots[0], cleanName)
}

func parseIDFromPath(path, prefix string) (int, error) {
	raw := strings.TrimPrefix(path, prefix)
	raw = strings.TrimSpace(raw)
	if raw == "" || strings.Contains(raw, "/") {
		return 0, fmt.Errorf("invalid event id")
	}
	id, err := strconv.Atoi(raw)
	if err != nil || id <= 0 {
		return 0, fmt.Errorf("invalid event id")
	}
	return id, nil
}

func normalizeUsername(v string) string {
	v = strings.TrimSpace(v)
	v = strings.TrimPrefix(v, "@")
	v = strings.TrimSpace(v)
	return strings.ToLower(v)
}

func isAllowedEventType(v string) bool {
	switch v {
	case "join", "comment", "like", "gift", "share", "follow":
		return true
	default:
		return false
	}
}

func parseEventRecordsPayload(b []byte) ([]eventRecord, error) {
	b = []byte(strings.TrimSpace(string(b)))
	if len(b) == 0 {
		return nil, fmt.Errorf("event payload is empty")
	}

	var wrapped struct {
		Items []eventRecord `json:"items"`
	}
	if err := json.Unmarshal(b, &wrapped); err == nil && wrapped.Items != nil {
		return wrapped.Items, nil
	}

	var direct []eventRecord
	if err := json.Unmarshal(b, &direct); err == nil {
		return direct, nil
	}

	return nil, fmt.Errorf("invalid event payload format")
}

func normalizeImportedEvents(items []eventRecord) ([]eventRecord, error) {
	if items == nil {
		return []eventRecord{}, nil
	}

	gifts, giftErr := loadGiftListJSON(appGiftList)
	if giftErr != nil {
		return nil, fmt.Errorf("failed to read gift list: %w", giftErr)
	}

	out := make([]eventRecord, 0, len(items))
	usedIDs := make(map[int]struct{}, len(items))
	maxID := 0

	for i := range items {
		item := items[i]
		item.Type = strings.TrimSpace(strings.ToLower(item.Type))
		if !isAllowedEventType(item.Type) {
			return nil, fmt.Errorf("item #%d has invalid type: %q", i+1, item.Type)
		}

		item.Title = strings.TrimSpace(item.Title)
		item.Label = strings.TrimSpace(item.Label)
		item.SoundURL = strings.TrimSpace(item.SoundURL)
		item.MCCommand = strings.TrimSpace(item.MCCommand)
		item.ShortcutKeys = strings.TrimSpace(item.ShortcutKeys)

		if item.Type == "like" && item.Label != "" {
			n, err := strconv.Atoi(item.Label)
			if err != nil || n < 0 {
				return nil, fmt.Errorf("item #%d has invalid like label: %q", i+1, item.Label)
			}
		}

		if item.Type == "gift" {
			if item.GiftID <= 0 {
				return nil, fmt.Errorf("item #%d is gift but gift_id is empty", i+1)
			}
			gift, ok := findGiftByID(gifts, item.GiftID)
			if !ok {
				return nil, fmt.Errorf("item #%d gift_id %d not found in gift list", i+1, item.GiftID)
			}
			item.GiftName = gift.NamaGift
			item.Diamond = gift.Diamond
		} else {
			item.GiftID = 0
			item.GiftName = ""
			item.Diamond = 0
		}

		normalizeEventExecutionMode(&item)

		if item.ID > 0 {
			if _, exists := usedIDs[item.ID]; exists {
				item.ID = 0
			} else {
				usedIDs[item.ID] = struct{}{}
				if item.ID > maxID {
					maxID = item.ID
				}
			}
		} else {
			item.ID = 0
		}

		out = append(out, item)
	}

	for i := range out {
		if out[i].ID > 0 {
			continue
		}
		maxID++
		out[i].ID = maxID
	}

	return out, nil
}

func loadGiftListJSON(path string) ([]giftListJSONItem, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return []giftListJSONItem{}, nil
		}
		return nil, err
	}
	if len(strings.TrimSpace(string(b))) == 0 {
		return []giftListJSONItem{}, nil
	}
	var items []giftListJSONItem
	if err := json.Unmarshal(b, &items); err != nil {
		return nil, err
	}
	return items, nil
}

func findGiftByID(items []giftListJSONItem, id int) (giftListJSONItem, bool) {
	for _, it := range items {
		if it.ID == id {
			return it, true
		}
	}
	return giftListJSONItem{}, false
}

func loadProperties(path string) (map[string]string, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	out := make(map[string]string)
	lines := strings.Split(string(b), "\n")
	for _, line := range lines {
		s := strings.TrimSpace(line)
		if s == "" || strings.HasPrefix(s, "#") {
			continue
		}
		idx := strings.Index(s, "=")
		if idx <= 0 {
			continue
		}
		key := strings.TrimSpace(s[:idx])
		val := strings.TrimSpace(s[idx+1:])
		out[key] = val
	}
	return out, nil
}

func fetchGiftCatalogFromUsername(username string) ([]giftCatalogItem, string, string, string, error) {
	username = strings.TrimSpace(strings.TrimPrefix(username, "@"))
	if username == "" {
		return nil, "", "", "", fmt.Errorf("username is required")
	}

	tiktok, err := gotiktoklive.NewTikTok()
	if err != nil {
		return nil, "", "", "", err
	}

	roomID, region, err := resolveRoomInfoFromUsername(tiktok, username)
	if err == nil && strings.TrimSpace(roomID) != "" {
		gifts, fetchErr := fetchGiftCatalog(tiktok, roomID, username)
		if fetchErr == nil && len(gifts) > 0 {
			if strings.TrimSpace(region) == "" {
				for _, g := range gifts {
					if strings.TrimSpace(g.Region) != "" {
						region = strings.TrimSpace(g.Region)
						break
					}
				}
			}
			return gifts, roomID, region, "live_room", nil
		}
	}

	// Fallback when the user is offline: try generic webcast gift list without room bind.
	fallbackGifts, fallbackErr := fetchGiftCatalog(nil, "0", username)
	if fallbackErr == nil && len(fallbackGifts) > 0 {
		if strings.TrimSpace(region) == "" {
			for _, g := range fallbackGifts {
				if strings.TrimSpace(g.Region) != "" {
					region = strings.TrimSpace(g.Region)
					break
				}
			}
		}
		return fallbackGifts, "0", region, "web_fallback", nil
	}

	// Last fallback: keep service working using existing local gift cache.
	cached, cacheErr := loadGiftListJSON(appGiftList)
	if cacheErr == nil && len(cached) > 0 {
		return toCatalogItemsFromGiftList(cached), "", region, "local_cache", nil
	}

	if err != nil {
		return nil, "", "", "", err
	}
	if fallbackErr != nil {
		return nil, "", "", "", fallbackErr
	}
	return nil, "", "", "", fmt.Errorf("failed to fetch gift catalog for @%s", username)
}

func toCatalogItemsFromGiftList(items []giftListJSONItem) []giftCatalogItem {
	out := make([]giftCatalogItem, 0, len(items))
	for _, it := range items {
		out = append(out, giftCatalogItem{
			ID:        it.ID,
			Name:      it.NamaGift,
			Diamonds:  it.Diamond,
			Region:    it.Region,
			ImageURL:  it.ImageURL,
			ImagePath: it.ImagePath,
		})
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].Diamonds == out[j].Diamonds {
			if out[i].Name == out[j].Name {
				return out[i].ID < out[j].ID
			}
			return out[i].Name < out[j].Name
		}
		return out[i].Diamonds < out[j].Diamonds
	})
	return out
}

func resolveRoomInfoFromUsername(tiktok *gotiktoklive.TikTok, username string) (string, string, error) {
	if tiktok == nil {
		return "", "", fmt.Errorf("tiktok client is nil")
	}
	username = strings.TrimSpace(strings.TrimPrefix(username, "@"))
	if username == "" {
		return "", "", fmt.Errorf("username is required")
	}

	getRoomInfo := reflect.ValueOf(tiktok).MethodByName("GetRoomInfo")
	if !getRoomInfo.IsValid() {
		return "", "", fmt.Errorf("get room info is not available in current gotiktoklive version")
	}
	result := getRoomInfo.Call([]reflect.Value{reflect.ValueOf(username)})
	if len(result) != 2 {
		return "", "", fmt.Errorf("unexpected get room info response")
	}

	if !result[1].IsNil() {
		if err, ok := result[1].Interface().(error); ok && err != nil {
			return "", "", fmt.Errorf("failed to resolve room for @%s: %w", username, err)
		}
		return "", "", fmt.Errorf("failed to resolve room for @%s", username)
	}
	if result[0].IsNil() {
		return "", "", fmt.Errorf("room info for @%s is empty", username)
	}

	roomInfo := result[0].Interface()
	roomID := extractReflectStringValue(roomInfo, "RoomID", "RoomId", "room_id", "roomid", "ID", "Id", "id")
	if strings.TrimSpace(roomID) == "" {
		return "", "", fmt.Errorf("room_id not found for @%s; make sure the account is currently live", username)
	}
	region := extractReflectStringValue(roomInfo, "Region", "region", "Country", "country", "CountryCode", "country_code", "Area", "area")
	return roomID, strings.TrimSpace(region), nil
}

func extractReflectStringValue(src any, names ...string) string {
	if src == nil {
		return ""
	}
	v := reflect.ValueOf(src)
	for v.IsValid() {
		if v.Kind() == reflect.Pointer {
			if v.IsNil() {
				return ""
			}
			v = v.Elem()
			continue
		}
		break
	}
	if !v.IsValid() {
		return ""
	}

	for _, name := range names {
		if s := extractFieldString(v, name); s != "" {
			return s
		}
	}
	return ""
}

func extractFieldString(v reflect.Value, name string) string {
	if !v.IsValid() {
		return ""
	}
	switch v.Kind() {
	case reflect.Struct:
		f := v.FieldByName(name)
		if f.IsValid() {
			if s := valueToString(f); s != "" {
				return s
			}
		}
		for i := 0; i < v.NumField(); i++ {
			if s := extractFieldString(v.Field(i), name); s != "" {
				return s
			}
		}
	case reflect.Map:
		for _, key := range v.MapKeys() {
			ks := strings.TrimSpace(fmt.Sprintf("%v", key.Interface()))
			if strings.EqualFold(ks, name) {
				if s := valueToString(v.MapIndex(key)); s != "" {
					return s
				}
			}
			if s := extractFieldString(v.MapIndex(key), name); s != "" {
				return s
			}
		}
	case reflect.Interface, reflect.Pointer:
		if v.IsNil() {
			return ""
		}
		return extractFieldString(v.Elem(), name)
	}
	return ""
}

func valueToString(v reflect.Value) string {
	if !v.IsValid() {
		return ""
	}
	for v.IsValid() && (v.Kind() == reflect.Interface || v.Kind() == reflect.Pointer) {
		if v.IsNil() {
			return ""
		}
		v = v.Elem()
	}
	if !v.IsValid() {
		return ""
	}
	switch v.Kind() {
	case reflect.String:
		return strings.TrimSpace(v.String())
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		if v.Int() == 0 {
			return ""
		}
		return strconv.FormatInt(v.Int(), 10)
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		if v.Uint() == 0 {
			return ""
		}
		return strconv.FormatUint(v.Uint(), 10)
	case reflect.Float32, reflect.Float64:
		if v.Float() == 0 {
			return ""
		}
		return strconv.FormatFloat(v.Float(), 'f', -1, 64)
	default:
		return ""
	}
}

func fallbackRegion(region string) string {
	region = strings.TrimSpace(region)
	if region == "" {
		return "-"
	}
	return region
}

type giftCatalogItem struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Describe  string `json:"describe"`
	Diamonds  int    `json:"diamonds"`
	Type      int    `json:"type"`
	Region    string `json:"region,omitempty"`
	ImageURL  string `json:"image_url,omitempty"`
	ImagePath string `json:"image_path,omitempty"`
}

type giftListJSONItem struct {
	ID        int    `json:"id"`
	NamaGift  string `json:"nama_gift"`
	Diamond   int    `json:"diamond"`
	Region    string `json:"region,omitempty"`
	ImageURL  string `json:"image_url,omitempty"`
	ImagePath string `json:"image_path,omitempty"`
}

func fetchGiftCatalog(tiktok *gotiktoklive.TikTok, roomID string, username string) ([]giftCatalogItem, error) {
	if tiktok != nil {
		if info, err := tiktok.GetGiftInfo(roomID); err == nil && info != nil && len(info.Gifts) > 0 {
			seen := make(map[int]giftCatalogItem, len(info.Gifts))
			for _, g := range info.Gifts {
				if g.ID == 0 {
					continue
				}
				seen[g.ID] = giftCatalogItem{
					ID:       g.ID,
					Name:     g.Name,
					Describe: g.Describe,
					Diamonds: g.DiamondCount,
					Type:     g.Type,
					Region:   strings.TrimSpace(g.Region),
					ImageURL: firstNonEmptyString(g.Image.URLList),
				}
			}
			out := sortGiftCatalogItems(seen)
			if len(out) > 0 {
				return out, nil
			}
		}
	}

	if strings.TrimSpace(roomID) == "" {
		return nil, fmt.Errorf("room_id is empty")
	}
	username = strings.TrimSpace(strings.TrimPrefix(username, "@"))

	ua := "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
	baseURL := "https://webcast.tiktok.com/webcast/gift/list/"

	query := url.Values{}
	query.Set("aid", "1988")
	query.Set("app_language", "en-US")
	query.Set("app_name", "tiktok_web")
	query.Set("browser_language", "en")
	query.Set("browser_name", "Mozilla")
	query.Set("browser_online", "true")
	query.Set("browser_platform", "Win32")
	query.Set("browser_version", ua)
	query.Set("cookie_enabled", "true")
	query.Set("device_platform", "web")
	query.Set("focus_state", "true")
	query.Set("from_page", "live")
	query.Set("is_fullscreen", "false")
	query.Set("is_page_visible", "true")
	query.Set("live_id", "12")
	query.Set("resp_content_type", "protobuf")
	query.Set("screen_height", "1152")
	query.Set("screen_width", "2048")
	query.Set("tz_name", "Asia/Jakarta")
	referer := "https://www.tiktok.com/"
	if username != "" {
		referer = "https://www.tiktok.com/@" + username + "/live"
	}
	query.Set("referer", referer)
	query.Set("root_referer", "https://www.tiktok.com")
	query.Set("version_code", "180800")
	query.Set("webcast_sdk_version", "1.3.0")
	query.Set("update_version_code", "1.3.0")
	query.Set("room_id", roomID)

	req, err := http.NewRequest(http.MethodGet, baseURL+"?"+query.Encode(), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Accept", "application/json,text/html")
	req.Header.Set("Referer", referer)
	req.Header.Set("Origin", "https://www.tiktok.com")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")

	client := &http.Client{Timeout: 20 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("status %d", resp.StatusCode)
	}

	var parsed struct {
		Data struct {
			Gifts []struct {
				ID           int    `json:"id"`
				Name         string `json:"name"`
				Describe     string `json:"describe"`
				DiamondCount int    `json:"diamond_count"`
				Type         int    `json:"type"`
				Image        struct {
					URLList []string `json:"url_list"`
					URI     string   `json:"uri"`
				} `json:"image"`
				Images []struct {
					URLList []string `json:"url_list"`
					URI     string   `json:"uri"`
				} `json:"images"`
			} `json:"gifts"`
		} `json:"data"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}

	seen := make(map[int]giftCatalogItem, len(parsed.Data.Gifts))
	for _, g := range parsed.Data.Gifts {
		if g.ID == 0 {
			continue
		}
		seen[g.ID] = giftCatalogItem{
			ID:       g.ID,
			Name:     g.Name,
			Describe: g.Describe,
			Diamonds: g.DiamondCount,
			Type:     g.Type,
			ImageURL: firstNonEmptyGiftImageURL(g.Image.URLList, g.Images),
		}
	}
	return sortGiftCatalogItems(seen), nil
}

func saveGiftListJSON(path string, username string, gifts []giftCatalogItem) (string, error) {
	_ = username

	items := make([]giftListJSONItem, 0, len(gifts))
	for _, g := range gifts {
		items = append(items, giftListJSONItem{
			ID:        g.ID,
			NamaGift:  g.Name,
			Diamond:   g.Diamonds,
			Region:    g.Region,
			ImageURL:  g.ImageURL,
			ImagePath: g.ImagePath,
		})
	}

	b, err := json.MarshalIndent(items, "", "  ")
	if err != nil {
		return "", err
	}
	if err := os.WriteFile(path, b, 0644); err != nil {
		return "", err
	}
	return path, nil
}

func firstNonEmptyGiftImageURL(primary []string, extras []struct {
	URLList []string `json:"url_list"`
	URI     string   `json:"uri"`
}) string {
	if u := firstNonEmptyString(primary); u != "" {
		return u
	}
	for _, item := range extras {
		if u := firstNonEmptyString(item.URLList); u != "" {
			return u
		}
	}
	return ""
}

func firstNonEmptyString(values []string) string {
	for _, u := range values {
		u = strings.TrimSpace(u)
		if u != "" {
			return u
		}
	}
	return ""
}

func sortGiftCatalogItems(seen map[int]giftCatalogItem) []giftCatalogItem {
	out := make([]giftCatalogItem, 0, len(seen))
	for _, item := range seen {
		out = append(out, item)
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].Diamonds == out[j].Diamonds {
			if out[i].Name == out[j].Name {
				return out[i].ID < out[j].ID
			}
			return out[i].Name < out[j].Name
		}
		return out[i].Diamonds < out[j].Diamonds
	})
	return out
}

func downloadGiftImages(dir string, gifts []giftCatalogItem) (int, []string) {
	if err := os.MkdirAll(dir, 0755); err != nil {
		return 0, []string{fmt.Sprintf("failed to create %s: %v", dir, err)}
	}

	client := &http.Client{Timeout: 20 * time.Second}
	downloaded := 0
	var errs []string

	for i := range gifts {
		imageURL := strings.TrimSpace(gifts[i].ImageURL)
		if gifts[i].ID <= 0 || imageURL == "" {
			continue
		}

		fileBase := giftImageFileBase(gifts[i].Diamonds, gifts[i].Name, gifts[i].ID)
		fileExt := detectGiftImageExt(imageURL, "")
		targetPath := filepath.Join(dir, fileBase+fileExt)
		if existingPath, ok := existingGiftImagePath(dir, fileBase); ok {
			gifts[i].ImagePath = giftImageWebPathFromDiskPath(existingPath)
			continue
		}

		req, err := http.NewRequest(http.MethodGet, imageURL, nil)
		if err != nil {
			errs = append(errs, fmt.Sprintf("gift %d: %v", gifts[i].ID, err))
			continue
		}
		req.Header.Set("User-Agent", "Mozilla/5.0")

		resp, err := client.Do(req)
		if err != nil {
			errs = append(errs, fmt.Sprintf("gift %d: %v", gifts[i].ID, err))
			continue
		}

		body, readErr := io.ReadAll(resp.Body)
		_ = resp.Body.Close()
		if readErr != nil {
			errs = append(errs, fmt.Sprintf("gift %d: %v", gifts[i].ID, readErr))
			continue
		}
		if resp.StatusCode >= 400 {
			errs = append(errs, fmt.Sprintf("gift %d: status %d", gifts[i].ID, resp.StatusCode))
			continue
		}

		fileExt = detectGiftImageExt(imageURL, resp.Header.Get("Content-Type"))
		targetPath = filepath.Join(dir, fileBase+fileExt)
		if err := os.WriteFile(targetPath, body, 0644); err != nil {
			errs = append(errs, fmt.Sprintf("gift %d: %v", gifts[i].ID, err))
			continue
		}

		gifts[i].ImagePath = giftImageWebPathFromDiskPath(targetPath)
		downloaded++
	}

	return downloaded, errs
}

func giftImageWebPathFromDiskPath(path string) string {
	base := strings.TrimSpace(filepath.Base(path))
	if base == "" {
		return ""
	}
	return filepath.ToSlash(filepath.Join("giftimage", base))
}

func existingGiftImagePath(dir string, fileBase string) (string, bool) {
	pattern := filepath.Join(dir, fileBase+".*")
	matches, err := filepath.Glob(pattern)
	if err != nil || len(matches) == 0 {
		return "", false
	}
	return matches[0], true
}

func giftImageFileBase(diamonds int, name string, giftID int) string {
	name = strings.TrimSpace(name)
	name = strings.Map(func(r rune) rune {
		switch r {
		case '<', '>', ':', '"', '/', '\\', '|', '?', '*':
			return -1
		default:
			return r
		}
	}, name)
	name = strings.Join(strings.Fields(name), " ")
	name = strings.Trim(name, ". ")
	if name == "" {
		name = strconv.Itoa(giftID)
	}
	prefix := strconv.Itoa(diamonds)
	if diamonds < 0 {
		prefix = "0"
	}
	return prefix + "_" + name
}

func detectGiftImageExt(rawURL string, contentType string) string {
	if ct := strings.TrimSpace(contentType); ct != "" {
		if exts, _ := mime.ExtensionsByType(strings.Split(ct, ";")[0]); len(exts) > 0 {
			return exts[0]
		}
	}
	if parsed, err := url.Parse(rawURL); err == nil {
		ext := strings.ToLower(filepath.Ext(parsed.Path))
		switch ext {
		case ".png", ".jpg", ".jpeg", ".webp", ".gif":
			return ext
		}
	}
	return ".jpg"
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func sanitizeUploadFilename(name string) string {
	name = strings.TrimSpace(filepath.Base(name))
	if name == "" {
		name = "sound.mp3"
	}
	name = strings.Map(func(r rune) rune {
		switch {
		case r >= 'a' && r <= 'z':
			return r
		case r >= 'A' && r <= 'Z':
			return r
		case r >= '0' && r <= '9':
			return r
		case r == '.', r == '-', r == '_':
			return r
		case r == ' ':
			return '-'
		default:
			return -1
		}
	}, name)
	if name == "" || strings.HasPrefix(name, ".") {
		return "sound.mp3"
	}
	return name
}

func isAllowedAudioExt(ext string) bool {
	switch strings.ToLower(strings.TrimSpace(ext)) {
	case ".mp3", ".wav", ".ogg", ".m4a", ".aac":
		return true
	default:
		return false
	}
}

func mustJSON(v any) string {
	b, err := json.Marshal(v)
	if err != nil {
		return `{"type":"error","error":"json marshal failed"}`
	}
	return string(b)
}
