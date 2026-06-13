package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/steampoweredtaco/gotiktoklive"
)

// ---------------------------------------------------------------------------
// normalizeUsername
// ---------------------------------------------------------------------------

func TestNormalizeUsername(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{"alice", "alice"},
		{"  Alice  ", "alice"},
		{"@bob", "bob"},
		{"@ charlie ", "charlie"},
		{"", ""},
		{"  ", ""},
	}
	for _, tc := range tests {
		got := normalizeUsername(tc.input)
		if got != tc.want {
			t.Errorf("normalizeUsername(%q) = %q; want %q", tc.input, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// normalizeUsernameCandidate
// ---------------------------------------------------------------------------

func TestNormalizeUsernameCandidate(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{"alice", "alice"},
		{"@bob", "bob"},
		{"  @charlie  ", "charlie"},
		{"user/extra", "user"},
		{"user?query=1", "user"},
		{"user#hash", "user"},
		{"", ""},
		{"https://www.tiktok.com/@testuser/live", "testuser"},
		{"prefix:actualname", "actualname"},
	}
	for _, tc := range tests {
		got := normalizeUsernameCandidate(tc.input)
		if got != tc.want {
			t.Errorf("normalizeUsernameCandidate(%q) = %q; want %q", tc.input, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// usernameFromTikTokProfileURL
// ---------------------------------------------------------------------------

func TestUsernameFromTikTokProfileURL(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{"https://www.tiktok.com/@myuser", "myuser"},
		{"https://tiktok.com/@hello/live", "hello"},
		{"www.tiktok.com/@someone", "someone"},
		{"tiktok.com/@test", "test"},
		{"https://example.com/@nope", ""},
		{"", ""},
		{"https://www.tiktok.com/", ""},
		{"https://www.tiktok.com/@user?tab=videos", "user"},
	}
	for _, tc := range tests {
		got := usernameFromTikTokProfileURL(tc.input)
		if got != tc.want {
			t.Errorf("usernameFromTikTokProfileURL(%q) = %q; want %q", tc.input, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// isLikelyNumericUserID
// ---------------------------------------------------------------------------

func TestIsLikelyNumericUserID(t *testing.T) {
	tests := []struct {
		input string
		want  bool
	}{
		{"1234567890", true},
		{"0", true},
		{"abc", false},
		{"12abc", false},
		{"", false},
		{"  ", false},
		{"123 456", false},
	}
	for _, tc := range tests {
		got := isLikelyNumericUserID(tc.input)
		if got != tc.want {
			t.Errorf("isLikelyNumericUserID(%q) = %v; want %v", tc.input, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// safeUsernameFromUser / safeNicknameFromUser
// ---------------------------------------------------------------------------

func TestSafeUsernameFromUser(t *testing.T) {
	if got := safeUsernameFromUser(nil); got != "TestPlayer" {
		t.Errorf("safeUsernameFromUser(nil) = %q; want %q", got, "TestPlayer")
	}
	u := &gotiktoklive.User{Username: "  alice  "}
	if got := safeUsernameFromUser(u); got != "alice" {
		t.Errorf("safeUsernameFromUser(alice) = %q; want %q", got, "alice")
	}
	u2 := &gotiktoklive.User{Username: ""}
	if got := safeUsernameFromUser(u2); got != "TestPlayer" {
		t.Errorf("safeUsernameFromUser(empty) = %q; want %q", got, "TestPlayer")
	}
}

func TestSafeNicknameFromUser(t *testing.T) {
	if got := safeNicknameFromUser(nil); got != "TestPlayer" {
		t.Errorf("safeNicknameFromUser(nil) = %q; want %q", got, "TestPlayer")
	}
	u := &gotiktoklive.User{Nickname: "  Nick  "}
	if got := safeNicknameFromUser(u); got != "Nick" {
		t.Errorf("safeNicknameFromUser(Nick) = %q; want %q", got, "Nick")
	}
	u2 := &gotiktoklive.User{Nickname: "", Username: "fallback_user"}
	if got := safeNicknameFromUser(u2); got != "fallback_user" {
		t.Errorf("safeNicknameFromUser(fallback) = %q; want %q", got, "fallback_user")
	}
	u3 := &gotiktoklive.User{}
	if got := safeNicknameFromUser(u3); got != "TestPlayer" {
		t.Errorf("safeNicknameFromUser(empty) = %q; want %q", got, "TestPlayer")
	}
}

// ---------------------------------------------------------------------------
// firstStringValue
// ---------------------------------------------------------------------------

func TestFirstStringValue(t *testing.T) {
	if got := firstStringValue(nil, "", "hello"); got != "hello" {
		t.Errorf("firstStringValue = %q; want %q", got, "hello")
	}
	if got := firstStringValue("  ", " world "); got != "world" {
		t.Errorf("firstStringValue = %q; want %q", got, "world")
	}
	if got := firstStringValue(nil, nil); got != "" {
		t.Errorf("firstStringValue(nil,nil) = %q; want empty", got)
	}
	if got := firstStringValue(42, "ok"); got != "ok" {
		t.Errorf("firstStringValue(42,'ok') = %q; want %q", got, "ok")
	}
}

// ---------------------------------------------------------------------------
// normalizeMinecraftMode
// ---------------------------------------------------------------------------

func TestNormalizeMinecraftMode(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{"rcon", "rcon"},
		{"RCON", "rcon"},
		{"servertap", "servertap"},
		{"ServerTap", "servertap"},
		{"  servertap  ", "servertap"},
		{"anything_else", "rcon"},
		{"", "rcon"},
	}
	for _, tc := range tests {
		got := normalizeMinecraftMode(tc.input)
		if got != tc.want {
			t.Errorf("normalizeMinecraftMode(%q) = %q; want %q", tc.input, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// isAllowedEventType
// ---------------------------------------------------------------------------

func TestIsAllowedEventType(t *testing.T) {
	allowed := []string{"join", "comment", "like", "gift", "share", "follow", "other"}
	for _, v := range allowed {
		if !isAllowedEventType(v) {
			t.Errorf("isAllowedEventType(%q) = false; want true", v)
		}
	}
	notAllowed := []string{"", "invalid", "GIFT", "Join"}
	for _, v := range notAllowed {
		if isAllowedEventType(v) {
			t.Errorf("isAllowedEventType(%q) = true; want false", v)
		}
	}
}

// ---------------------------------------------------------------------------
// normalizeEventExecutionMode
// ---------------------------------------------------------------------------

func TestNormalizeEventExecutionMode(t *testing.T) {
	t.Run("nil is safe", func(t *testing.T) {
		normalizeEventExecutionMode(nil)
	})

	t.Run("clamps shortcut hold", func(t *testing.T) {
		item := &eventRecord{ShortcutHold: -5, RunMCCommand: true}
		normalizeEventExecutionMode(item)
		if item.ShortcutHold != 0 {
			t.Errorf("ShortcutHold = %d; want 0", item.ShortcutHold)
		}
		item.ShortcutHold = 99999
		normalizeEventExecutionMode(item)
		if item.ShortcutHold != 10000 {
			t.Errorf("ShortcutHold = %d; want 10000", item.ShortcutHold)
		}
	})

	t.Run("clamps shortcut press count", func(t *testing.T) {
		item := &eventRecord{ShortcutPressCount: 0, RunMCCommand: true}
		normalizeEventExecutionMode(item)
		if item.ShortcutPressCount != 1 {
			t.Errorf("ShortcutPressCount = %d; want 1", item.ShortcutPressCount)
		}
		item.ShortcutPressCount = 200
		normalizeEventExecutionMode(item)
		if item.ShortcutPressCount != 100 {
			t.Errorf("ShortcutPressCount = %d; want 100", item.ShortcutPressCount)
		}
	})

	t.Run("clamps run duration", func(t *testing.T) {
		item := &eventRecord{RunDurationMs: -1, RunMCCommand: true}
		normalizeEventExecutionMode(item)
		if item.RunDurationMs != 0 {
			t.Errorf("RunDurationMs = %d; want 0", item.RunDurationMs)
		}
		item.RunDurationMs = 700000
		normalizeEventExecutionMode(item)
		if item.RunDurationMs != 600000 {
			t.Errorf("RunDurationMs = %d; want 600000", item.RunDurationMs)
		}
	})

	t.Run("disables shortcut when keys empty", func(t *testing.T) {
		item := &eventRecord{RunShortcut: true, ShortcutKeys: "", RunMCCommand: false}
		normalizeEventExecutionMode(item)
		if item.RunShortcut {
			t.Error("RunShortcut should be false when ShortcutKeys is empty")
		}
		// Both false -> default to MC command
		if !item.RunMCCommand {
			t.Error("RunMCCommand should default to true when both are false")
		}
	})

	t.Run("non-gift type disables repeat_by_gift_combo", func(t *testing.T) {
		item := &eventRecord{Type: "comment", RepeatByGiftCombo: true, RunMCCommand: true}
		normalizeEventExecutionMode(item)
		if item.RepeatByGiftCombo {
			t.Error("RepeatByGiftCombo should be false for non-gift types")
		}
	})

	t.Run("gift type preserves repeat_by_gift_combo", func(t *testing.T) {
		item := &eventRecord{Type: "gift", RepeatByGiftCombo: true, RunMCCommand: true}
		normalizeEventExecutionMode(item)
		if !item.RepeatByGiftCombo {
			t.Error("RepeatByGiftCombo should remain true for gift type")
		}
	})
}

// ---------------------------------------------------------------------------
// eventRecord UnmarshalJSON
// ---------------------------------------------------------------------------

func TestEventRecordUnmarshalJSON(t *testing.T) {
	t.Run("defaults when fields missing", func(t *testing.T) {
		data := `{"id":1,"type":"gift","title":"test"}`
		var rec eventRecord
		if err := json.Unmarshal([]byte(data), &rec); err != nil {
			t.Fatalf("UnmarshalJSON error: %v", err)
		}
		if rec.RepeatByGiftCombo != false {
			t.Error("expected RepeatByGiftCombo=false")
		}
		if rec.ShowInExport != true {
			t.Error("expected ShowInExport=true")
		}
		if rec.RunDurationMs != 1000 {
			t.Errorf("expected RunDurationMs=1000, got %d", rec.RunDurationMs)
		}
		if rec.ShortcutPressCount != 1 {
			t.Errorf("expected ShortcutPressCount=1, got %d", rec.ShortcutPressCount)
		}
	})

	t.Run("explicit values override defaults", func(t *testing.T) {
		data := `{"id":2,"type":"gift","repeat_by_gift_combo":true,"show_in_export":false,"run_duration_ms":5000,"shortcut_press_count":3}`
		var rec eventRecord
		if err := json.Unmarshal([]byte(data), &rec); err != nil {
			t.Fatalf("UnmarshalJSON error: %v", err)
		}
		if !rec.RepeatByGiftCombo {
			t.Error("expected RepeatByGiftCombo=true")
		}
		if rec.ShowInExport {
			t.Error("expected ShowInExport=false")
		}
		if rec.RunDurationMs != 5000 {
			t.Errorf("expected RunDurationMs=5000, got %d", rec.RunDurationMs)
		}
		if rec.ShortcutPressCount != 3 {
			t.Errorf("expected ShortcutPressCount=3, got %d", rec.ShortcutPressCount)
		}
	})

	t.Run("invalid json returns error", func(t *testing.T) {
		var rec eventRecord
		if err := json.Unmarshal([]byte(`{invalid`), &rec); err == nil {
			t.Error("expected error for invalid JSON")
		}
	})
}

// ---------------------------------------------------------------------------
// nextLikeGoalThreshold
// ---------------------------------------------------------------------------

func TestNextLikeGoalThreshold(t *testing.T) {
	tests := []struct {
		current int
		base    int
		mode    string
		want    int
	}{
		{1000, 1000, "increase", 2000},
		{2000, 1000, "increase", 3000},
		{1000, 1000, "double", 2000},
		{2000, 1000, "double", 4000},
		{4000, 1000, "double", 8000},
		// base <= 0 falls back to 1
		{100, 0, "increase", 101},
		{100, -5, "increase", 101},
		// double overflow protection
		{1 << 31, 1000, "double", (1 << 31) + 1000},
	}
	for _, tc := range tests {
		got := nextLikeGoalThreshold(tc.current, tc.base, tc.mode)
		if got != tc.want {
			t.Errorf("nextLikeGoalThreshold(%d, %d, %q) = %d; want %d",
				tc.current, tc.base, tc.mode, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// normalizeLikeGoalState
// ---------------------------------------------------------------------------

func TestNormalizeLikeGoalState(t *testing.T) {
	t.Run("nil safe", func(t *testing.T) {
		normalizeLikeGoalState(nil) // should not panic
	})

	t.Run("defaults applied", func(t *testing.T) {
		state := &likeGoalState{}
		normalizeLikeGoalState(state)
		if state.Title != "Like Goal" {
			t.Errorf("Title = %q; want %q", state.Title, "Like Goal")
		}
		if state.Goal != 1000 {
			t.Errorf("Goal = %d; want 1000", state.Goal)
		}
		if state.CurrentGoal != 1000 {
			t.Errorf("CurrentGoal = %d; want 1000", state.CurrentGoal)
		}
		if state.Mode != "increase" {
			t.Errorf("Mode = %q; want %q", state.Mode, "increase")
		}
	})

	t.Run("preserves valid values", func(t *testing.T) {
		state := &likeGoalState{
			Title:       "Custom",
			Goal:        500,
			CurrentGoal: 500,
			Mode:        "double",
		}
		normalizeLikeGoalState(state)
		if state.Title != "Custom" {
			t.Errorf("Title = %q; want %q", state.Title, "Custom")
		}
		if state.Goal != 500 {
			t.Errorf("Goal = %d; want 500", state.Goal)
		}
		if state.Mode != "double" {
			t.Errorf("Mode = %q; want %q", state.Mode, "double")
		}
	})

	t.Run("clamps negative likes", func(t *testing.T) {
		state := &likeGoalState{Goal: 100, CurrentGoal: 100, CurrentLikes: -5, TriggerCount: -3}
		normalizeLikeGoalState(state)
		if state.CurrentLikes != 0 {
			t.Errorf("CurrentLikes = %d; want 0", state.CurrentLikes)
		}
		if state.TriggerCount != 0 {
			t.Errorf("TriggerCount = %d; want 0", state.TriggerCount)
		}
	})
}

// ---------------------------------------------------------------------------
// applyCommandTemplate
// ---------------------------------------------------------------------------

func TestApplyCommandTemplate(t *testing.T) {
	tests := []struct {
		command string
		vars    map[string]string
		want    string
	}{
		{
			"say {username} joined",
			map[string]string{"username": "alice"},
			"say alice joined",
		},
		{
			"give {playername} diamond 1",
			map[string]string{"username": "bob"},
			"give bob diamond 1",
		},
		{
			"say {giftname} worth {coins}",
			map[string]string{"gift_name": "Rose", "diamond": "5"},
			"say Rose worth 5",
		},
		{
			"say likes={likecount} total={totallikecount}",
			map[string]string{"likes": "10", "total_likes": "100"},
			"say likes=10 total=100",
		},
		{
			"no placeholders here",
			map[string]string{"username": "test"},
			"no placeholders here",
		},
		{
			"say {username}",
			nil,
			"say {username}",
		},
	}
	for _, tc := range tests {
		got := applyCommandTemplate(tc.command, tc.vars)
		if got != tc.want {
			t.Errorf("applyCommandTemplate(%q, %v) = %q; want %q",
				tc.command, tc.vars, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// ruleLabelMatches
// ---------------------------------------------------------------------------

func TestRuleLabelMatches(t *testing.T) {
	t.Run("empty label always matches", func(t *testing.T) {
		rule := eventRecord{Label: ""}
		if !ruleLabelMatches(rule, map[string]string{}) {
			t.Error("empty label should always match")
		}
	})

	t.Run("comment contains label (case insensitive)", func(t *testing.T) {
		rule := eventRecord{Type: "comment", Label: "hello"}
		if !ruleLabelMatches(rule, map[string]string{"comment": "say Hello world"}) {
			t.Error("should match 'hello' in comment")
		}
		if ruleLabelMatches(rule, map[string]string{"comment": "goodbye"}) {
			t.Error("should not match 'hello' in 'goodbye'")
		}
	})

	t.Run("like threshold crossing", func(t *testing.T) {
		rule := eventRecord{Type: "like", Label: "100"}
		// Cross from 50 to 150 -> crosses 100 boundary
		if !ruleLabelMatches(rule, map[string]string{"likes": "150", "likes_prev": "50"}) {
			t.Error("should match when crossing 100 boundary")
		}
		// Already past (200 to 250, both in same segment [200,300))
		if ruleLabelMatches(rule, map[string]string{"likes": "250", "likes_prev": "200"}) {
			t.Error("should not match when not crossing boundary")
		}
		// Below threshold
		if ruleLabelMatches(rule, map[string]string{"likes": "50", "likes_prev": "30"}) {
			t.Error("should not match below threshold")
		}
	})

	t.Run("like invalid label", func(t *testing.T) {
		rule := eventRecord{Type: "like", Label: "abc"}
		if ruleLabelMatches(rule, map[string]string{"likes": "100"}) {
			t.Error("non-numeric label should not match")
		}
	})

	t.Run("like zero label", func(t *testing.T) {
		rule := eventRecord{Type: "like", Label: "0"}
		if ruleLabelMatches(rule, map[string]string{"likes": "100"}) {
			t.Error("zero label should not match")
		}
	})

	t.Run("other types always match with non-empty label", func(t *testing.T) {
		rule := eventRecord{Type: "gift", Label: "anything"}
		if !ruleLabelMatches(rule, map[string]string{}) {
			t.Error("non-comment/non-like types should always match")
		}
	})
}

// ---------------------------------------------------------------------------
// resolveGiftRepeatCount
// ---------------------------------------------------------------------------

func TestResolveGiftRepeatCount(t *testing.T) {
	tests := []struct {
		current int
		combo   int
		want    int
	}{
		{5, 10, 10},
		{5, 0, 5},
		{0, 0, 1},
		{0, 3, 3},
		{-1, 0, 1},
	}
	for _, tc := range tests {
		got := resolveGiftRepeatCount(tc.current, tc.combo)
		if got != tc.want {
			t.Errorf("resolveGiftRepeatCount(%d, %d) = %d; want %d",
				tc.current, tc.combo, got, tc.want)
		}
	}
}

// ---------------------------------------------------------------------------
// loadProperties
// ---------------------------------------------------------------------------

func TestLoadProperties(t *testing.T) {
	t.Run("valid properties file", func(t *testing.T) {
		dir := t.TempDir()
		path := filepath.Join(dir, "server.properties")
		content := `# Minecraft server properties
enable-rcon=true
rcon.port=25575
rcon.password=secret123
server-ip=
motd=A Minecraft Server
`
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			t.Fatal(err)
		}
		props, err := loadProperties(path)
		if err != nil {
			t.Fatalf("loadProperties error: %v", err)
		}
		if props["enable-rcon"] != "true" {
			t.Errorf("enable-rcon = %q; want %q", props["enable-rcon"], "true")
		}
		if props["rcon.port"] != "25575" {
			t.Errorf("rcon.port = %q; want %q", props["rcon.port"], "25575")
		}
		if props["rcon.password"] != "secret123" {
			t.Errorf("rcon.password = %q; want %q", props["rcon.password"], "secret123")
		}
		if props["server-ip"] != "" {
			t.Errorf("server-ip = %q; want empty", props["server-ip"])
		}
	})

	t.Run("nonexistent file", func(t *testing.T) {
		_, err := loadProperties("/nonexistent/path/file.properties")
		if err == nil {
			t.Error("expected error for nonexistent file")
		}
	})

	t.Run("skips comments and empty lines", func(t *testing.T) {
		dir := t.TempDir()
		path := filepath.Join(dir, "test.properties")
		content := `# comment
key1=value1

# another comment
key2=value2
`
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			t.Fatal(err)
		}
		props, err := loadProperties(path)
		if err != nil {
			t.Fatalf("loadProperties error: %v", err)
		}
		if len(props) != 2 {
			t.Errorf("expected 2 properties, got %d", len(props))
		}
	})
}

// ---------------------------------------------------------------------------
// parseShortcutKeyToken
// ---------------------------------------------------------------------------

func TestParseShortcutKeyToken(t *testing.T) {
	tests := []struct {
		input   string
		wantVK  uint16
		wantErr bool
	}{
		{"enter", 0x0D, false},
		{"Return", 0x0D, false},
		{"tab", 0x09, false},
		{"esc", 0x1B, false},
		{"escape", 0x1B, false},
		{"space", 0x20, false},
		{"backspace", 0x08, false},
		{"delete", 0x2E, false},
		{"up", 0x26, false},
		{"down", 0x28, false},
		{"left", 0x25, false},
		{"right", 0x27, false},
		{"a", 0x41, false},
		{"z", 0x5A, false},
		{"0", 0x30, false},
		{"9", 0x39, false},
		{"f1", 0x70, false},
		{"f12", 0x7B, false},
	}
	for _, tc := range tests {
		spec, err := parseShortcutKeyToken(tc.input)
		if tc.wantErr {
			if err == nil {
				t.Errorf("parseShortcutKeyToken(%q): expected error", tc.input)
			}
			continue
		}
		if err != nil {
			t.Errorf("parseShortcutKeyToken(%q): unexpected error: %v", tc.input, err)
			continue
		}
		if spec.vk != tc.wantVK {
			t.Errorf("parseShortcutKeyToken(%q).vk = 0x%02X; want 0x%02X", tc.input, spec.vk, tc.wantVK)
		}
	}
}

// ---------------------------------------------------------------------------
// parseShortcutToVK
// ---------------------------------------------------------------------------

func TestParseShortcutToVK(t *testing.T) {
	t.Run("single key", func(t *testing.T) {
		mods, key, err := parseShortcutToVK("a")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(mods) != 0 {
			t.Errorf("expected no modifiers, got %v", mods)
		}
		if key.vk != 0x41 {
			t.Errorf("key.vk = 0x%02X; want 0x41", key.vk)
		}
	})

	t.Run("ctrl+alt+a", func(t *testing.T) {
		mods, key, err := parseShortcutToVK("ctrl+alt+a")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(mods) != 2 {
			t.Fatalf("expected 2 modifiers, got %d", len(mods))
		}
		if mods[0] != 0x11 {
			t.Errorf("mods[0] = 0x%02X; want 0x11 (VK_CONTROL)", mods[0])
		}
		if mods[1] != 0x12 {
			t.Errorf("mods[1] = 0x%02X; want 0x12 (VK_MENU)", mods[1])
		}
		if key.vk != 0x41 {
			t.Errorf("key.vk = 0x%02X; want 0x41", key.vk)
		}
	})

	t.Run("no main key errors", func(t *testing.T) {
		_, _, err := parseShortcutToVK("ctrl+alt")
		if err == nil {
			t.Error("expected error for no main key")
		}
	})

	t.Run("windows key errors", func(t *testing.T) {
		_, _, err := parseShortcutToVK("win+a")
		if err == nil {
			t.Error("expected error for windows key")
		}
	})

	t.Run("multiple main keys errors", func(t *testing.T) {
		_, _, err := parseShortcutToVK("a+b")
		if err == nil {
			t.Error("expected error for multiple main keys")
		}
	})
}

// ---------------------------------------------------------------------------
// splitCommands
// ---------------------------------------------------------------------------

func TestSplitCommands(t *testing.T) {
	tests := []struct {
		input string
		want  []string
	}{
		{"say hello\nsay world", []string{"say hello", "say world"}},
		{"/say hello\n/say world", []string{"say hello", "say world"}},
		{"  \n  \n", []string{}},
		{"single", []string{"single"}},
		{"/give player diamond 1\r\n/say done", []string{"give player diamond 1", "say done"}},
	}
	for _, tc := range tests {
		got := splitCommands(tc.input)
		if len(got) != len(tc.want) {
			t.Errorf("splitCommands(%q): got %d items, want %d", tc.input, len(got), len(tc.want))
			continue
		}
		for i := range got {
			if got[i] != tc.want[i] {
				t.Errorf("splitCommands(%q)[%d] = %q; want %q", tc.input, i, got[i], tc.want[i])
			}
		}
	}
}

// ---------------------------------------------------------------------------
// eventHub
// ---------------------------------------------------------------------------

func TestEventHub(t *testing.T) {
	hub := newEventHub()

	t.Run("subscribe and broadcast", func(t *testing.T) {
		ch := hub.subscribe()
		hub.broadcast("hello")
		msg := <-ch
		if msg != "hello" {
			t.Errorf("got %q; want %q", msg, "hello")
		}
		hub.unsubscribe(ch)
	})

	t.Run("unsubscribe stops delivery", func(t *testing.T) {
		ch := hub.subscribe()
		hub.unsubscribe(ch)
		hub.broadcast("after unsub")
		// channel should be closed
		_, ok := <-ch
		if ok {
			t.Error("expected channel to be closed after unsubscribe")
		}
	})

	t.Run("multiple subscribers", func(t *testing.T) {
		ch1 := hub.subscribe()
		ch2 := hub.subscribe()
		hub.broadcast("multi")
		if msg := <-ch1; msg != "multi" {
			t.Errorf("ch1 got %q; want %q", msg, "multi")
		}
		if msg := <-ch2; msg != "multi" {
			t.Errorf("ch2 got %q; want %q", msg, "multi")
		}
		hub.unsubscribe(ch1)
		hub.unsubscribe(ch2)
	})
}

// ---------------------------------------------------------------------------
// eventStore
// ---------------------------------------------------------------------------

func TestEventStore(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "events.json")
	// Write initial empty array
	if err := os.WriteFile(path, []byte("[]"), 0644); err != nil {
		t.Fatal(err)
	}

	store, err := newEventStore(path)
	if err != nil {
		t.Fatalf("newEventStore error: %v", err)
	}

	t.Run("create", func(t *testing.T) {
		rec, err := store.create("gift", "Test Gift", "", 123, false, true, "Rose", 5, "", "say hello", true, false, "", 0, 1, 1000)
		if err != nil {
			t.Fatalf("create error: %v", err)
		}
		if rec.ID != 1 {
			t.Errorf("ID = %d; want 1", rec.ID)
		}
		if rec.Type != "gift" {
			t.Errorf("Type = %q; want %q", rec.Type, "gift")
		}
	})

	t.Run("list", func(t *testing.T) {
		items := store.list()
		if len(items) != 1 {
			t.Fatalf("list len = %d; want 1", len(items))
		}
		if items[0].Title != "Test Gift" {
			t.Errorf("Title = %q; want %q", items[0].Title, "Test Gift")
		}
	})

	t.Run("update", func(t *testing.T) {
		rec, err := store.update(1, "gift", "Updated Gift", "", 123, true, true, "Rose", 5, "", "say updated", true, false, "", 0, 1, 2000)
		if err != nil {
			t.Fatalf("update error: %v", err)
		}
		if rec.Title != "Updated Gift" {
			t.Errorf("Title = %q; want %q", rec.Title, "Updated Gift")
		}
	})

	t.Run("update nonexistent", func(t *testing.T) {
		_, err := store.update(999, "gift", "Ghost", "", 0, false, true, "", 0, "", "", true, false, "", 0, 1, 1000)
		if err == nil {
			t.Error("expected error for nonexistent ID")
		}
	})

	t.Run("getByID", func(t *testing.T) {
		rec, ok := store.getByID(1)
		if !ok {
			t.Fatal("getByID(1) not found")
		}
		if rec.Title != "Updated Gift" {
			t.Errorf("Title = %q; want %q", rec.Title, "Updated Gift")
		}
		_, ok = store.getByID(999)
		if ok {
			t.Error("getByID(999) should not find anything")
		}
	})

	t.Run("rulesForTrigger", func(t *testing.T) {
		// Create another event with different gift_id
		_, _ = store.create("gift", "Another Gift", "", 456, false, true, "Star", 10, "", "say star", true, false, "", 0, 1, 1000)
		rules := store.rulesForTrigger("gift", 123)
		if len(rules) != 1 {
			t.Errorf("rulesForTrigger: got %d; want 1", len(rules))
		}
	})

	t.Run("delete", func(t *testing.T) {
		err := store.delete(1)
		if err != nil {
			t.Fatalf("delete error: %v", err)
		}
		items := store.list()
		if len(items) != 1 {
			t.Errorf("list after delete = %d; want 1", len(items))
		}
		err = store.delete(999)
		if err == nil {
			t.Error("expected error deleting nonexistent ID")
		}
	})

	t.Run("resetAll", func(t *testing.T) {
		err := store.resetAll()
		if err != nil {
			t.Fatalf("resetAll error: %v", err)
		}
		items := store.list()
		if len(items) != 0 {
			t.Errorf("list after reset = %d; want 0", len(items))
		}
	})
}

// ---------------------------------------------------------------------------
// parseEventRecordsPayload
// ---------------------------------------------------------------------------

func TestParseEventRecordsPayload(t *testing.T) {
	t.Run("wrapped format", func(t *testing.T) {
		data := `{"items":[{"id":1,"type":"gift","title":"Rose"}]}`
		items, err := parseEventRecordsPayload([]byte(data))
		if err != nil {
			t.Fatalf("error: %v", err)
		}
		if len(items) != 1 {
			t.Fatalf("len = %d; want 1", len(items))
		}
		if items[0].Title != "Rose" {
			t.Errorf("Title = %q; want %q", items[0].Title, "Rose")
		}
	})

	t.Run("direct array format", func(t *testing.T) {
		data := `[{"id":1,"type":"gift","title":"Star"}]`
		items, err := parseEventRecordsPayload([]byte(data))
		if err != nil {
			t.Fatalf("error: %v", err)
		}
		if len(items) != 1 {
			t.Fatalf("len = %d; want 1", len(items))
		}
	})

	t.Run("empty payload", func(t *testing.T) {
		_, err := parseEventRecordsPayload([]byte(""))
		if err == nil {
			t.Error("expected error for empty payload")
		}
	})

	t.Run("invalid format", func(t *testing.T) {
		_, err := parseEventRecordsPayload([]byte("not json"))
		if err == nil {
			t.Error("expected error for invalid JSON")
		}
	})
}

// ---------------------------------------------------------------------------
// mcRCONManager basic operations
// ---------------------------------------------------------------------------

func TestMCRCONManagerBasic(t *testing.T) {
	dir := t.TempDir()
	propPath := filepath.Join(dir, "server.properties")
	content := `enable-rcon=true
rcon.port=25575
rcon.password=testpass
server-ip=192.168.1.1
`
	if err := os.WriteFile(propPath, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	m := newMCRCONManagerFromProperties(propPath)

	t.Run("loads properties", func(t *testing.T) {
		if !m.Enabled() {
			t.Error("expected Enabled=true")
		}
		status := m.Status()
		if status["host"] != "192.168.1.1" {
			t.Errorf("host = %q; want %q", status["host"], "192.168.1.1")
		}
		if status["port"] != 25575 {
			t.Errorf("port = %v; want 25575", status["port"])
		}
	})

	t.Run("SetEnabled", func(t *testing.T) {
		m.SetEnabled(false)
		if m.Enabled() {
			t.Error("expected Enabled=false after SetEnabled(false)")
		}
		m.SetEnabled(true)
		if !m.Enabled() {
			t.Error("expected Enabled=true after SetEnabled(true)")
		}
	})

	t.Run("disconnect when not connected", func(t *testing.T) {
		m.Disconnect() // should not panic
	})
}

// ---------------------------------------------------------------------------
// defaultLikeGoalState
// ---------------------------------------------------------------------------

func TestDefaultLikeGoalState(t *testing.T) {
	state := defaultLikeGoalState()
	if state.Title != "Like Goal" {
		t.Errorf("Title = %q; want %q", state.Title, "Like Goal")
	}
	if state.Goal != 1000 {
		t.Errorf("Goal = %d; want 1000", state.Goal)
	}
	if state.CurrentGoal != 1000 {
		t.Errorf("CurrentGoal = %d; want 1000", state.CurrentGoal)
	}
	if state.Mode != "increase" {
		t.Errorf("Mode = %q; want %q", state.Mode, "increase")
	}
	if !state.Enabled {
		t.Error("expected Enabled=true")
	}
}

// ---------------------------------------------------------------------------
// isFollowerFromIdentity
// ---------------------------------------------------------------------------

func TestIsFollowerFromIdentity(t *testing.T) {
	t.Run("nil identity and nil user", func(t *testing.T) {
		if isFollowerFromIdentity(nil, nil) {
			t.Error("expected false for nil identity and nil user")
		}
	})

	t.Run("identity with IsFollower=true", func(t *testing.T) {
		id := &gotiktoklive.UserIdentity{IsFollower: true}
		if !isFollowerFromIdentity(id, nil) {
			t.Error("expected true when identity.IsFollower=true")
		}
	})

	t.Run("identity with IsFollower=false", func(t *testing.T) {
		id := &gotiktoklive.UserIdentity{IsFollower: false}
		if isFollowerFromIdentity(id, nil) {
			t.Error("expected false when identity.IsFollower=false")
		}
	})

	t.Run("user with FollowRole > 0", func(t *testing.T) {
		u := &gotiktoklive.User{
			ExtraAttributes: &gotiktoklive.ExtraAttributes{FollowRole: 1},
		}
		if !isFollowerFromIdentity(nil, u) {
			t.Error("expected true when user.ExtraAttributes.FollowRole > 0")
		}
	})

	t.Run("user with FollowRole = 0", func(t *testing.T) {
		u := &gotiktoklive.User{
			ExtraAttributes: &gotiktoklive.ExtraAttributes{FollowRole: 0},
		}
		if isFollowerFromIdentity(nil, u) {
			t.Error("expected false when user.ExtraAttributes.FollowRole = 0")
		}
	})
}
