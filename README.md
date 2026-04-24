# TikStream

Bridge event TikTok Live ke aksi otomatis (Minecraft command + keyboard shortcut) dengan backend Go dan dashboard web.

README ini fokus ke kode aplikasi utama dan web UI. Detail isi folder `server/` tidak dibahas.

## Ringkasan Fitur

- Tracking TikTok Live dengan auto reconnect.
- License gate saat `POST /start` berbasis allowlist username dari GitHub.
- Otomasi event:
  - `gift`, `join`, `follow`, `comment`, `like`, `share`, `other`
- Aksi per event:
  - jalankan command ke connector Minecraft (`run_mc_command`)
  - jalankan shortcut keyboard (`run_shortcut`, Windows-only)
  - atau keduanya
- Gift catalog:
  - refresh per username (`/api/gifts/refresh`)
  - simpan ke `gift-list.json`
  - cache gambar ke `giftimage/`
- SSE realtime (`/events`) untuk status, log event, dan update like goal.
- CRUD event + test event + preset profile (`P-*.json`) dari dashboard.
- Like Goal (OBS overlay) dengan endpoint khusus dan halaman `/overlay/like-goal`.
- Event List Box (gift cards) + export PNG slides.
- UI bilingual (Indonesia/English).

## Teknologi

- Go `1.25.0` (sesuai `go.mod`)
- `github.com/steampoweredtaco/gotiktoklive v0.0.4` (di-`replace` ke `./third_party/gotiktoklive`)
- `github.com/gorcon/rcon v1.4.0`
- HTML, CSS, Vanilla JS

## Struktur Proyek

- `main.go`
  - HTTP server + SSE
  - TikTok stream controller
  - automation engine
  - connector Minecraft (RCON + ServerTap mode)
  - API settings, event, gift, simulator, like goal
- `shortcut_windows.go`, `shortcut_nonwindows.go`
  - eksekusi keyboard shortcut per OS
- `web/index.html`
  - dashboard utama
- `web/overlay-like-goal.html`
  - halaman overlay like goal
- `web/static/app.js`
  - seluruh logic frontend dashboard
- `web/static/overlay-like-goal.js`
  - logic realtime overlay
- `web/static/styles.css`
  - styling dashboard + overlay
- `gift-list.json`
  - cache daftar gift
- `giftimage/`
  - cache gambar gift
- `sounds/`
  - upload audio trigger
- `settings.json`
  - unified settings aplikasi
- `P-Default.json`, `P-*.json`
  - default/preset event profile
- `third_party/gotiktoklive/`
  - dependency lokal untuk client TikTok Live

## Menjalankan Aplikasi

```bash
go run .
```

Perilaku listener:

- bind ke `127.0.0.1:${PORT}`
- default `PORT=8080`
- jika `VERCEL` atau `AWS_LAMBDA_FUNCTION_NAME` terdeteksi: host jadi `0.0.0.0`
- URL dicetak ke log: `Web ready at http://<host>:<port>`
- browser dibuka otomatis (kecuali mode serverless)
- jika port gagal dibind, aplikasi `exit` (tidak ada fallback ke random port)

## Alur Penggunaan Dashboard

1. Isi username TikTok.
2. Klik `Start` untuk refresh gift list berdasarkan username (`/api/gifts/refresh`).
3. Klik `Connect` untuk mulai tracking live (`/start`).
4. Atur connector Minecraft (`rcon` atau `servertap`) lalu connect bila diperlukan.
5. Buat/edit event rule.
6. Pantau history realtime di panel `History` (SSE `/events`).
7. Gunakan `Event Simulator` atau tombol `Run` per event untuk pengujian.

## Format Event Rule

Contoh item:

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
  "mc_command": "say {username}",
  "run_mc_command": true,
  "run_shortcut": false,
  "shortcut_keys": "",
  "shortcut_hold_ms": 0,
  "run_duration_ms": 0
}
```

Catatan validasi penting:

- `type`: `join | comment | like | gift | share | follow | other`
- `label` untuk `like` harus angka `>= 0`
- `gift_id` (jika diisi) harus ada di `gift-list.json`
- minimal satu aksi wajib aktif: `run_mc_command` atau `run_shortcut`
- jika `run_mc_command=true`, `mc_command` wajib terisi
- jika `run_shortcut=true`, `shortcut_keys` wajib terisi
- `shortcut_hold_ms`: `0..10000`
- `run_duration_ms`: `0..600000`

## Placeholder Template

Didukung pada `mc_command` dan `shortcut_keys`:

- `{playername}`
- `{username}`
- `{nickname}`
- `{comment}`
- `{giftname}`
- `{coins}`
- `{repeatcount}`
- `{likecount}`
- `{totallikecount}`

## Repeat by Gift Combo

Khusus event `gift`:

- `repeat_by_gift_combo=false`:
  - trigger per event (delta repeat count)
- `repeat_by_gift_combo=true`:
  - tunggu hingga combo selesai (`RepeatEnd=true`)
  - trigger dijalankan berurutan satu per satu sesuai total akhir combo
  - setiap trigger memakai `repeatcount=1`

## Settings dan Data Runtime

File utama:

- `settings.json` menyimpan:
  - `username`
  - `active_profile`
  - `minecraft` (`enabled`, `mode`, `host`, `rcon_port`, `servertap_port`, `rcon_password`, `servertap_password`, `servertap_path`)
  - `like_goal`
  - `event_box`
- event default tersimpan di `P-Default.json`
- preset profile memakai pola `P-<Nama>.json`
- upload audio tersimpan di `sounds/`
- cache gambar gift tersimpan di `giftimage/`

Penentuan root data:

- jika `APP_DATA_DIR` di-set, semua file runtime dipakai dari folder itu
- jika runtime serverless, dipakai `${TMP}/tikstream`
- selain itu pakai lokasi file yang tersedia dari `cwd`/direktori executable

## Like Goal

- API:
  - `GET/PUT /api/like-goal`
  - `POST /api/like-goal/reset`
  - `POST /api/like-goal/test`
- Overlay:
  - halaman `GET /overlay/like-goal`
  - stream update dari SSE `/events` (`type=like_goal_state`)
- Mode:
  - `increase`
  - `double`

## Endpoint API

Halaman, state, stream:

- `GET /`
- `GET /overlay/like-goal`
- `GET /state`
- `POST /start`
- `POST /stop`
- `GET /events` (SSE)

Settings:

- `GET /api/settings`
- `PUT /api/settings`

Event:

- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`
- `POST /api/events/load`
- `POST /api/events/reset`
- `POST /api/events/test/{id}`

Preset profile:

- `GET /api/events/profiles`
- `POST /api/events/create-profile`
- `POST /api/events/load-profile`
- `POST /api/events/save-profile`
- `POST /api/events/rename-profile`

Gift, asset, sound:

- `GET /api/gifts`
- `POST /api/gifts/refresh`
- `POST /api/upload/sound`
- `GET /giftimage/...`
- `GET /static/...`

Minecraft connector:

- `GET /api/minecraft/status`
- `POST /api/minecraft/connect`
- `POST /api/minecraft/disconnect`
- `POST /api/minecraft/command`

Alias legacy (tetap tersedia):

- `GET /api/minecraft/rcon/status`
- `POST /api/minecraft/rcon/connect`
- `POST /api/minecraft/rcon/disconnect`
- `POST /api/minecraft/rcon/command`

Simulator:

- `POST /api/test/event`
- `POST /api/test/gift` (alias handler yang sama)

`/api/test/event` menerima `type`:

- `gift`
- `chat`
- `user_join`
- `user_follow`
- `user_share`
- `like`
- `room`
- `viewers`
- `question`
- `control`
- `mic_battle`
- `battles`
- `room_banner`
- `intro`

## Gift Refresh Fallback

Urutan sumber `/api/gifts/refresh`:

1. `live_room`
2. `web_fallback`
3. `local_cache` (`gift-list.json`)

Response memuat metadata: `source`, `region`, `room_id`.

## License Gate

Saat `POST /start`, username wajib lolos allowlist:

- URL default:
  - `https://raw.githubusercontent.com/zufarrizal/akses-go/refs/heads/main/username.txt`
- cache TTL: 30 detik
- jika gagal/tidak terdaftar: HTTP `403`

## Catatan Platform

- Keyboard shortcut hanya didukung Windows.
- Di OS non-Windows, trigger shortcut akan error: `keyboard shortcut is only supported on Windows`.
