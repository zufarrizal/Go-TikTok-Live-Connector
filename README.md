<p align="center">
  <img src="web/static/app-logo.svg" width="100" alt="TikStream Logo">
</p>

<h1 align="center">TikStream</h1>

<p align="center">
  <strong>Bridge TikTok Live events to Minecraft commands & keyboard shortcuts</strong><br>
  Real-time automation engine with web dashboard, OBS overlays, and gift analytics.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.25-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/HTML-CSS--JS-E34F26?style=flat-square&logo=html5&logoColor=white" alt="Frontend">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/License-Private-red?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/last-commit/zufarrizal/Go-TikTok-Live-Connector?style=flat-square" alt="Last Commit">
</p>

---

## What is TikStream?

TikStream is a **real-time bridge** between TikTok Live and Minecraft. When someone sends a gift, follows, likes, or comments on your TikTok Live, TikStream automatically triggers Minecraft commands, keyboard shortcuts, or both.

Built with **Go** for blazing-fast backend and **Vanilla JS** for a lightweight, zero-dependency frontend.

```
┌──────────────┐     WebSocket      ┌──────────────┐     RCON/ServerTap     ┌──────────────┐
│  TikTok Live │ ──────────────────► │   TikStream  │ ────────────────────► │   Minecraft  │
│    Events    │                     │   Engine     │                       │    Server    │
└──────────────┘                     └──────┬───────┘                       └──────────────┘
                                            │
                                            │ SSE
                                            ▼
                                     ┌──────────────┐
                                     │   Dashboard  │
                                     │   + Overlays │
                                     └──────────────┘
```

---

## Features

### Core Engine
- **Real-time TikTok Live tracking** with auto-reconnect
- **7 event types**: `gift`, `join`, `follow`, `comment`, `like`, `share`, `other`
- **Gift combo tracking** — handles grouped gifts with repeat count
- **Command injection protection** — `sanitizeMCVar()` strips dangerous characters
- **License gate** — username allowlist via GitHub raw file

### Automation
- **Minecraft commands** via RCON or ServerTap
- **Keyboard shortcuts** (Windows) with configurable hold duration & press count
- **Sound triggers** — upload custom audio per event
- **Placeholder templates** — `{username}`, `{giftname}`, `{coins}`, `{repeatcount}`, etc.
- **Repeat by Gift Combo** — trigger once per combo or per individual gift

### Dashboard
- **Session Statistics** — real-time diamonds, gifts, likes, follows, comments, duration
- **Top Gifters** leaderboard with diamond counts
- **Session Summary** modal on stream stop
- **Event Panel** with drag-to-reorder (click-to-select)
- **Event List Box** with PNG slide export
- **Auto-save settings** — MC connector fields save automatically with debounce
- **Bilingual UI** — Indonesia / English toggle
- **Event Simulator** — test any event type without going live

### OBS Overlays
- **Like Goal** — progress bar overlay with increase/double modes
- **Overlay URL** — copy-paste into OBS Browser Source

### Data & Profiles
- **Preset profiles** — save/load event configurations (`P-*.json`)
- **Gift catalog** — auto-download with image cache
- **Unified settings** — single `settings.json` for all config

### Security
- **Watermark protection** — XOR-encrypted integrity verification
- **Tamper-proof** — modifying watermark data kills the app
- **Command injection prevention** — all template variables are sanitized

---

## Quick Start

### Prerequisites

- **Go 1.25.0+** — [go.dev/dl](https://go.dev/dl/)
- **Git** — [git-scm.com](https://git-scm.com/)

### Install & Run

```bash
# Clone
git clone https://github.com/zufarrizal/Go-TikTok-Live-Connector.git
cd Go-TikTok-Live-Connector

# Build
go build -o tikstream .

# Run
./tikstream
```

Open **http://127.0.0.1:8080** in your browser.

### Usage Flow

```
1. Enter TikTok username → Click "Download" (fetches gift list)
2. Click "Connect" → Starts tracking live events
3. Connect Minecraft (RCON/ServerTap) if needed
4. Create event rules → Commands trigger automatically
5. Monitor in History panel (real-time SSE)
```

---

## Project Structure

```
TikStream/
├── main.go                    # HTTP server, SSE, automation engine, MC connector
├── watermark.go               # Integrity verification (XOR-encrypted)
├── shortcut_windows.go        # Keyboard shortcut execution (Windows)
├── shortcut_nonwindows.go     # Stub for non-Windows platforms
├── go.mod / go.sum            # Go module dependencies
├── web/
│   ├── index.html             # Main dashboard
│   ├── overlay-like-goal.html # OBS overlay page
│   └── static/
│       ├── app.js             # Frontend logic (4400+ lines)
│       ├── overlay-like-goal.js
│       ├── styles.css         # Dark theme UI
│       ├── app-logo.svg
│       ├── html2canvas.min.js
│       ├── flags/             # Language flag icons
│       └── vendor/            # Third-party JS
├── third_party/gotiktoklive/  # Forked TikTok Live client (custom GroupID support)
├── settings.json              # Unified app settings
├── P-Default.json             # Default event profile
├── gift-list.json             # Gift catalog cache
├── giftimage/                 # Gift image cache
└── sounds/                    # Uploaded audio triggers
```

---

## Event Rule Format

```json
{
  "id": 1,
  "type": "gift",
  "title": "Blow A Kiss",
  "label": "",
  "gift_id": 10716,
  "gift_name": "Blow a kiss",
  "diamond": 1,
  "repeat_by_gift_combo": false,
  "show_in_export": true,
  "sound_url": "/static/sounds/example.mp3",
  "mc_command": "say {username} sent {giftname} x{repeatcount}!",
  "run_mc_command": true,
  "run_shortcut": false,
  "shortcut_keys": "",
  "shortcut_hold_ms": 0,
  "shortcut_press_count": 1,
  "run_duration_ms": 1000
}
```

### Validation Rules

| Field | Rule |
|-------|------|
| `type` | `join \| comment \| like \| gift \| share \| follow \| other` |
| `label` | For `like` events: must be a number `>= 0` |
| `gift_id` | If set, must exist in `gift-list.json` |
| Actions | At least one of `run_mc_command` or `run_shortcut` must be `true` |
| `mc_command` | Required if `run_mc_command=true` |
| `shortcut_keys` | Required if `run_shortcut=true` |
| `shortcut_hold_ms` | Range: `0..10000` |
| `run_duration_ms` | Range: `0..600000` |

### Placeholders

Available in `mc_command` and `shortcut_keys`:

| Placeholder | Description |
|-------------|-------------|
| `{playername}` | TikTok username |
| `{username}` | TikTok username |
| `{nickname}` | TikTok display name |
| `{comment}` | Comment text |
| `{giftname}` | Gift name |
| `{coins}` | Gift diamond value |
| `{repeatcount}` | Gift repeat count |
| `{likecount}` | Like delta |
| `{totallikecount}` | Total likes from user |

---

## API Reference

### Stream Control

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Dashboard |
| `GET` | `/overlay/like-goal` | OBS overlay |
| `GET` | `/state` | Current stream state |
| `POST` | `/start` | Start tracking |
| `POST` | `/stop` | Stop tracking |
| `GET` | `/events` | SSE stream |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings` | Load settings |
| `PUT` | `/api/settings` | Save settings |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | List events |
| `POST` | `/api/events` | Create event |
| `PUT` | `/api/events/{id}` | Update event |
| `DELETE` | `/api/events/{id}` | Delete event |
| `POST` | `/api/events/reorder` | Reorder events |
| `POST` | `/api/events/load` | Import events from JSON |
| `POST` | `/api/events/reset` | Reset all events |
| `POST` | `/api/events/test/{id}` | Test event |

### Profiles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events/profiles` | List profiles |
| `POST` | `/api/events/create-profile` | Create profile |
| `POST` | `/api/events/load-profile` | Load profile |
| `POST` | `/api/events/save-profile` | Save profile |
| `POST` | `/api/events/rename-profile` | Rename profile |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Session statistics |

### Gifts & Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gifts` | List gifts |
| `POST` | `/api/gifts/refresh` | Refresh gift catalog |
| `POST` | `/api/upload/sound` | Upload audio |

### Minecraft Connector

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/minecraft/status` | Connection status |
| `POST` | `/api/minecraft/connect` | Connect (RCON/ServerTap) |
| `POST` | `/api/minecraft/disconnect` | Disconnect |
| `POST` | `/api/minecraft/command` | Send command |

### Like Goal

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/PUT` | `/api/like-goal` | Get/update config |
| `POST` | `/api/like-goal/reset` | Reset progress |
| `POST` | `/api/like-goal/test` | Send test event |

### Simulator

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/test/event` | Simulate event |

Supported simulation types: `gift`, `chat`, `user_join`, `user_follow`, `user_share`, `like`, `room`, `viewers`, `question`, `control`, `mic_battle`, `battles`, `room_banner`, `intro`

---

## Gift Refresh Fallback

The `/api/gifts/refresh` endpoint tries sources in order:

1. **live_room** — fetch from active TikTok Live room
2. **web_fallback** — fetch from TikTok web API
3. **local_cache** — read from `gift-list.json`

Response includes metadata: `source`, `region`, `room_id`.

---

## Like Goal Overlay

### Modes

- **Increase** — progress bar fills toward the goal
- **Double** — goal doubles each time it's reached

### OBS Setup

1. Add a **Browser Source** in OBS
2. Set URL to: `http://127.0.0.1:8080/overlay/like-goal`
3. Set width/height as needed
4. Check "Refresh browser when scene becomes active"

---

## Gift Combo Mode

For `gift` events:

| Mode | Behavior |
|------|----------|
| `repeat_by_gift_combo: false` | Trigger per event (delta repeat count) |
| `repeat_by_gift_combo: true` | Wait for combo end, then trigger sequentially |

---

## Settings & Runtime Data

### Settings File (`settings.json`)

```json
{
  "settings": {
    "username": "your_tiktok_username",
    "active_profile": "Default",
    "minecraft": {
      "enabled": true,
      "mode": "rcon",
      "host": "127.0.0.1",
      "port": 25575,
      "password": "your_rcon_password"
    },
    "like_goal": {
      "title": "Like Goal",
      "goal": 1000,
      "mode": "increase",
      "enabled": true
    }
  }
}
```

### Data Paths

| Path | Description |
|------|-------------|
| `settings.json` | Unified app settings |
| `P-Default.json` | Default event profile |
| `P-<name>.json` | Preset profiles |
| `gift-list.json` | Gift catalog cache |
| `giftimage/` | Gift image cache |
| `sounds/` | Uploaded audio files |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `8080`) |
| `APP_DATA_DIR` | Custom data directory |
| `VERCEL` | Auto-detected: binds to `0.0.0.0` |
| `AWS_LAMBDA_FUNCTION_NAME` | Auto-detected: binds to `0.0.0.0` |

---

## Platform Notes

| Feature | Windows | Linux | macOS |
|---------|---------|-------|-------|
| Keyboard shortcuts | ✅ Full support | ❌ Not supported | ❌ Not supported |
| RCON connector | ✅ | ✅ | ✅ |
| ServerTap connector | ✅ | ✅ | ✅ |
| Gift tracking | ✅ | ✅ | ✅ |
| OBS overlays | ✅ | ✅ | ✅ |

---

## License Gate

The `POST /start` endpoint requires the TikTok username to pass an allowlist check:

- **Allowlist URL**: `https://raw.githubusercontent.com/zufarrizal/akses-go/refs/heads/main/username.txt`
- **Cache TTL**: 30 seconds
- **Failure**: HTTP `403 Forbidden`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Go 1.25.0 |
| TikTok Client | `gotiktoklive` (forked, custom GroupID support) |
| Minecraft | `gorcon/rcon` + ServerTap HTTP API |
| Frontend | Vanilla HTML/CSS/JS (zero dependencies) |
| Communication | SSE (Server-Sent Events) |
| Styling | Custom dark theme, responsive |

---

## Author

Built by **[MASJUP](https://wa.me/6285156560055)**

GitHub: **[@zufarrizal](https://github.com/zufarrizal)**

---

<p align="center">
  <sub>🔒 Protected by watermark integrity verification</sub>
</p>
