package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorcon/rcon"
	"github.com/steampoweredtaco/gotiktoklive"
)

type eventHub struct {
	mu      sync.RWMutex
	clients map[chan string]struct{}
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

func (c *streamController) run(ctx context.Context, session uint64, username string) {
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
			if !sleepOrCancel(ctx, 5*time.Second) {
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
			if !sleepOrCancel(ctx, 5*time.Second) {
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
		if gifts, err := fetchGiftCatalog(live.ID); err != nil {
			c.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": "failed to fetch gift catalog: " + err.Error(),
				"time":  time.Now().Format(time.RFC3339),
			}))
		} else {
			downloadedCount, downloadErrs := downloadGiftImages("giftimage", gifts)
			if len(downloadErrs) > 0 {
				c.hub.broadcast(mustJSON(map[string]any{
					"type":  "error",
					"error": fmt.Sprintf("gift image download completed with %d error(s): %s", len(downloadErrs), strings.Join(downloadErrs[:min(len(downloadErrs), 3)], "; ")),
					"time":  time.Now().Format(time.RFC3339),
				}))
			}
			outFile, saveErr := saveGiftListJSON(username, gifts)
			if saveErr != nil {
				c.hub.broadcast(mustJSON(map[string]any{
					"type":  "error",
					"error": "failed to save gift list json: " + saveErr.Error(),
					"time":  time.Now().Format(time.RFC3339),
				}))
			} else {
				c.hub.broadcast(mustJSON(map[string]any{
					"type":    "status",
					"message": fmt.Sprintf("Gift list saved to %s and downloaded %d gift image(s) to giftimage", outFile, downloadedCount),
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
					go c.onEvent(event)
				}
			}
		}

		live.Close()
		c.setLive(session, nil)

		c.hub.broadcast(mustJSON(map[string]any{
			"type":    "status",
			"message": "Disconnected. Reconnecting in 5s...",
			"time":    time.Now().Format(time.RFC3339),
		}))

		if !sleepOrCancel(ctx, 5*time.Second) {
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
	ID        int    `json:"id"`
	Type      string `json:"type"`
	Label     string `json:"label"`
	GiftID    int    `json:"gift_id"`
	GiftName  string `json:"gift_name"`
	Diamond   int    `json:"diamond"`
	SoundURL  string `json:"sound_url"`
	MCCommand string `json:"mc_command"`
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

	_ = m.refreshFromPropertiesLocked()

	if strings.TrimSpace(host) != "" {
		m.cfg.Host = strings.TrimSpace(host)
	}
	if port > 0 && port <= 65535 {
		m.cfg.Port = port
	}
	if password != "" {
		m.cfg.Password = password
	}
	if !m.cfg.Enabled {
		m.lastError = "enable-rcon=false in Server/server.properties"
		return errors.New(m.lastError)
	}
	if strings.TrimSpace(m.cfg.Password) == "" {
		m.lastError = "rcon.password is empty"
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
	s.items = items
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

func (s *eventStore) nextIDLocked() int {
	maxID := 0
	for _, it := range s.items {
		if it.ID > maxID {
			maxID = it.ID
		}
	}
	return maxID + 1
}

func (s *eventStore) create(eventType, label string, giftID int, giftName string, diamond int, soundURL string, mcCommand string) (eventRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	item := eventRecord{
		ID:        s.nextIDLocked(),
		Type:      strings.TrimSpace(eventType),
		Label:     strings.TrimSpace(label),
		GiftID:    giftID,
		GiftName:  strings.TrimSpace(giftName),
		Diamond:   diamond,
		SoundURL:  strings.TrimSpace(soundURL),
		MCCommand: strings.TrimSpace(mcCommand),
	}
	s.items = append(s.items, item)
	if err := s.saveLocked(); err != nil {
		return eventRecord{}, err
	}
	return item, nil
}

func (s *eventStore) update(id int, eventType, label string, giftID int, giftName string, diamond int, soundURL string, mcCommand string) (eventRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.items {
		if s.items[i].ID == id {
			s.items[i].Type = strings.TrimSpace(eventType)
			s.items[i].Label = strings.TrimSpace(label)
			s.items[i].GiftID = giftID
			s.items[i].GiftName = strings.TrimSpace(giftName)
			s.items[i].Diamond = diamond
			s.items[i].SoundURL = strings.TrimSpace(soundURL)
			s.items[i].MCCommand = strings.TrimSpace(mcCommand)
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
}

type giftComboProgress struct {
	Last        int
	Max         int
	Sum         int
	SawIncrease bool
}

func newMCEventAutomation(store *eventStore, rcon *mcRCONManager, hub *eventHub) *mcEventAutomation {
	return &mcEventAutomation{
		store:     store,
		rcon:      rcon,
		hub:       hub,
		giftCombo: make(map[int64]giftComboProgress),
	}
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
		cmd := applyCommandTemplate(rule.MCCommand, vars)
		out, err := a.rcon.Execute(cmd)
		triggerPayload := map[string]any{
			"type":         "trigger",
			"event_id":     rule.ID,
			"event_type":   eventType,
			"event_label":  rule.Label,
			"gift_id":      giftID,
			"gift_name":    vars["gift_name"],
			"username":     vars["username"],
			"repeat_count": vars["repeat_count"],
			"sound_url":    rule.SoundURL,
			"command":      cmd,
			"output":       out,
			"time":         time.Now().Format(time.RFC3339),
		}
		if err != nil {
			triggerPayload["command_error"] = err.Error()
			a.hub.broadcast(mustJSON(triggerPayload))
			a.hub.broadcast(mustJSON(map[string]any{
				"type":  "error",
				"error": fmt.Sprintf("auto MC command failed (event #%d): %v", rule.ID, err),
				"time":  time.Now().Format(time.RFC3339),
			}))
			continue
		}
		a.hub.broadcast(mustJSON(triggerPayload))
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

func main() {
	hub := newEventHub()
	store, err := newEventStore("events.json")
	if err != nil {
		log.Fatalf("failed to init event store: %v", err)
	}
	mcRCON := newMCRCONManagerFromProperties(filepath.Join("Server", "server.properties"))
	autoMC := newMCEventAutomation(store, mcRCON, hub)
	ctrl := newStreamController(hub, autoMC.HandleLiveEvent)

	staticFS := http.FileServer(http.Dir(filepath.Join("web", "static")))
	http.Handle("/static/", http.StripPrefix("/static/", staticFS))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join("web", "index.html"))
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
				Type      string `json:"type"`
				Label     string `json:"label"`
				GiftID    int    `json:"gift_id"`
				SoundURL  string `json:"sound_url"`
				MCCommand string `json:"mc_command"`
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
			req.Label = strings.TrimSpace(req.Label)
			if req.Type == "like" && req.Label != "" {
				n, err := strconv.Atoi(req.Label)
				if err != nil || n < 0 {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "like label must be a number >= 0"})
					return
				}
			}
			if strings.TrimSpace(req.MCCommand) == "" {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "mc_command is required"})
				return
			}
			req.SoundURL = strings.TrimSpace(req.SoundURL)
			giftID := 0
			giftName := ""
			diamond := 0
			if req.Type == "gift" {
				gifts, err := loadGiftListJSON("gift-list.json")
				if err != nil {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift-list.json: " + err.Error()})
					return
				}
				gift, ok := findGiftByID(gifts, req.GiftID)
				if !ok {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "gift_id not found in gift-list.json"})
					return
				}
				giftID = gift.ID
				giftName = gift.NamaGift
				diamond = gift.Diamond
			}
			item, err := store.create(req.Type, req.Label, giftID, giftName, diamond, req.SoundURL, req.MCCommand)
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
				Type      string `json:"type"`
				Label     string `json:"label"`
				GiftID    int    `json:"gift_id"`
				SoundURL  string `json:"sound_url"`
				MCCommand string `json:"mc_command"`
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
			req.Label = strings.TrimSpace(req.Label)
			if req.Type == "like" && req.Label != "" {
				n, err := strconv.Atoi(req.Label)
				if err != nil || n < 0 {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "like label must be a number >= 0"})
					return
				}
			}
			if strings.TrimSpace(req.MCCommand) == "" {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "mc_command is required"})
				return
			}
			req.SoundURL = strings.TrimSpace(req.SoundURL)
			giftID := 0
			giftName := ""
			diamond := 0
			if req.Type == "gift" {
				gifts, err := loadGiftListJSON("gift-list.json")
				if err != nil {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift-list.json: " + err.Error()})
					return
				}
				gift, ok := findGiftByID(gifts, req.GiftID)
				if !ok {
					writeJSON(w, http.StatusBadRequest, map[string]any{"error": "gift_id not found in gift-list.json"})
					return
				}
				giftID = gift.ID
				giftName = gift.NamaGift
				diamond = gift.Diamond
			}
			item, err := store.update(id, req.Type, req.Label, giftID, giftName, diamond, req.SoundURL, req.MCCommand)
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

	http.HandleFunc("/api/gifts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		items, err := loadGiftListJSON("gift-list.json")
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift-list.json: " + err.Error()})
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

		soundsDir := filepath.Join("web", "static", "sounds")
		if err := os.MkdirAll(soundsDir, 0755); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to create sound directory"})
			return
		}

		base := strings.TrimSuffix(fileName, ext)
		targetName := fileName
		targetPath := filepath.Join(soundsDir, targetName)
		for i := 1; ; i++ {
			if _, err := os.Stat(targetPath); os.IsNotExist(err) {
				break
			}
			targetName = fmt.Sprintf("%s-%d%s", base, i, ext)
			targetPath = filepath.Join(soundsDir, targetName)
		}

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
		out, err := mcRCON.Execute(req.Command)
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
		out, err := mcRCON.Execute(cmd)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": err.Error(), "status": mcRCON.Status()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"ok":      true,
			"eventId": id,
			"command": cmd,
			"output":  out,
			"status":  mcRCON.Status(),
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
			gifts, err := loadGiftListJSON("gift-list.json")
			if err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "failed to read gift-list.json: " + err.Error()})
				return
			}
			gift, ok := findGiftByID(gifts, req.GiftID)
			if !ok {
				writeJSON(w, http.StatusBadRequest, map[string]any{"error": "gift_id not found in gift-list.json"})
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

	addr := ":8080"
	log.Printf("Web ready at http://localhost%s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
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

func isAllowedEventType(v string) bool {
	switch v {
	case "join", "comment", "like", "gift", "share", "follow":
		return true
	default:
		return false
	}
}

func loadGiftListJSON(path string) ([]giftListJSONItem, error) {
	b, err := os.ReadFile(path)
	if err != nil {
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

type giftCatalogItem struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Describe  string `json:"describe"`
	Diamonds  int    `json:"diamonds"`
	Type      int    `json:"type"`
	ImageURL  string `json:"image_url,omitempty"`
	ImagePath string `json:"image_path,omitempty"`
}

type giftListJSONItem struct {
	ID        int    `json:"id"`
	NamaGift  string `json:"nama_gift"`
	Diamond   int    `json:"diamond"`
	ImageURL  string `json:"image_url,omitempty"`
	ImagePath string `json:"image_path,omitempty"`
}

func fetchGiftCatalog(roomID string) ([]giftCatalogItem, error) {
	if strings.TrimSpace(roomID) == "" {
		return nil, fmt.Errorf("room_id is empty")
	}

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
	query.Set("from_page", "user")
	query.Set("is_fullscreen", "false")
	query.Set("is_page_visible", "true")
	query.Set("live_id", "12")
	query.Set("resp_content_type", "protobuf")
	query.Set("screen_height", "1152")
	query.Set("screen_width", "2048")
	query.Set("tz_name", "Asia/Jakarta")
	query.Set("referer", "https://www.tiktok.com/")
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
	req.Header.Set("Referer", "https://www.tiktok.com/")
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
	return out, nil
}

func saveGiftListJSON(username string, gifts []giftCatalogItem) (string, error) {
	_ = username

	items := make([]giftListJSONItem, 0, len(gifts))
	for _, g := range gifts {
		items = append(items, giftListJSONItem{
			ID:        g.ID,
			NamaGift:  g.Name,
			Diamond:   g.Diamonds,
			ImageURL:  g.ImageURL,
			ImagePath: g.ImagePath,
		})
	}

	b, err := json.MarshalIndent(items, "", "  ")
	if err != nil {
		return "", err
	}
	if err := os.WriteFile("gift-list.json", b, 0644); err != nil {
		return "", err
	}
	return "gift-list.json", nil
}

func firstNonEmptyGiftImageURL(primary []string, extras []struct {
	URLList []string `json:"url_list"`
	URI     string   `json:"uri"`
}) string {
	for _, u := range primary {
		u = strings.TrimSpace(u)
		if u != "" {
			return u
		}
	}
	for _, item := range extras {
		for _, u := range item.URLList {
			u = strings.TrimSpace(u)
			if u != "" {
				return u
			}
		}
	}
	return ""
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
			gifts[i].ImagePath = filepath.ToSlash(existingPath)
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

		gifts[i].ImagePath = filepath.ToSlash(targetPath)
		downloaded++
	}

	return downloaded, errs
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
