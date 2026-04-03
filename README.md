# Go-TikTok-Live-Connector

Bridge event TikTok Live ke aksi Minecraft (RCON + keyboard shortcut) dengan backend Go dan dashboard web.

## Ringkasan

Project ini berisi:

- Backend Go untuk:
  - connect/track TikTok Live
  - menyimpan dan mengeksekusi rule event (`events.json`)
  - kirim command ke Minecraft via RCON
  - trigger keyboard shortcut (Windows)
  - stream history realtime via SSE
- Dashboard web (embedded di binary) untuk:
  - connect TikTok
  - refresh daftar gift
  - CRUD event rule
  - export/load/reset event JSON
  - upload sound trigger
  - test event/simulator
  - kontrol RCON
  - export Event List Box ke PNG slides
- Folder `server/` (Paper + Skript) untuk sisi gameplay Minecraft.

## Fitur Utama

- TikTok tracker dengan auto reconnect.
- Filtering username via allowlist GitHub (license gate saat `/start`).
- Otomasi event:
  - `gift`, `join`, `follow`, `comment`, `like`, `share`
- Eksekusi aksi event:
  - MC command (`run_mc_command`)
  - keyboard shortcut (`run_shortcut`, Windows-only)
  - atau keduanya bersamaan
- Penanganan gift combo grouped (`RepeatEnd`) agar `repeat_count` final akurat.
- Gift catalog sync + cache:
  - `gift-list.json`
  - image cache di `giftimage/`
- SSE `/events` untuk log realtime di dashboard.
- Event import/export/reset dari UI + endpoint API.

## Teknologi

- Go `1.25.0`
- `github.com/steampoweredtaco/gotiktoklive v0.0.4`
- `github.com/gorcon/rcon v1.4.0`
- HTML/CSS/Vanilla JS

## Struktur Proyek

- `main.go`
  - server HTTP
  - TikTok stream controller
  - event automation
  - RCON manager
  - simulator endpoint
- `events.json`
  - database rule event
- `gift-list.json`
  - cache daftar gift aktif
- `giftimage/`
  - cache gambar gift yang dipakai UI
- `sounds/`
  - storage upload audio runtime
  - diserve ke `/static/sounds/...`
- `web/index.html`, `web/static/app.js`, `web/static/styles.css`
  - dashboard UI
- `server/`
  - Paper server + Skript

## Menjalankan Aplikasi

```bash
go run .
```

Perilaku server web:

- mencoba bind ke `127.0.0.1:8080`
- jika port 8080 terpakai, fallback ke port random kosong
- URL final dicetak ke log (`Web ready at http://127.0.0.1:<port>`)
- browser dibuka otomatis

## Alur Operasional

1. Jalankan backend Go.
2. Buka dashboard dari URL yang tampil di log.
3. Isi username TikTok.
4. Tombol `Start`:
   - refresh gift list by username (`/api/gifts/refresh`)
5. Tombol `Connect`:
   - mulai tracking live (`/start`)
   - endpoint ini wajib lolos allowlist username (license gate)
6. Event live masuk -> dicocokkan ke `events.json` -> enqueue -> eksekusi aksi.
7. Log trigger/status/error tampil realtime melalui SSE `/events`.

## Format Rule Event (`events.json`)

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
  "sound_url": "/static/sounds/faaah.mp3",
  "mc_command": "tnt 10 {username} {repeat_count}",
  "run_mc_command": true,
  "run_shortcut": false,
  "shortcut_keys": "",
  "shortcut_hold_ms": 0
}
```

Field penting:

- `type`: `gift | join | follow | comment | like | share`
- `title`: judul untuk Event List Box
- `label`:
  - `comment`: substring match komentar
  - `like`: harus angka, exact match terhadap `likes`
- `gift_id`: wajib untuk tipe `gift` (harus ada di `gift-list.json`)
- `mc_command`: command template (boleh multi-line)
- `run_mc_command`: jalankan command ke RCON
- `run_shortcut`: jalankan shortcut keyboard
- `shortcut_keys`: wajib jika `run_shortcut=true`
- `shortcut_hold_ms`: 0-10000

Catatan kompatibilitas:

- Jika data lama punya `run_mc_command=false` dan `run_shortcut=false`, backend otomatis fallback `run_mc_command=true`.

## Placeholder Template

Template command/shortcut memakai format `{key}`.

Placeholder yang disuplai event live:

- `{event_type}`
- `{username}`
- `{nickname}`
- `{follow}`
- `{comment}`
- `{likes}`
- `{total_likes}`
- `{gift_name}`
- `{gift_id}`
- `{diamond}`
- `{repeat_count}`

Penggantian placeholder dilakukan oleh backend dengan `strings.ReplaceAll` per key.

## Gift Combo Behavior

Khusus grouped gift (`GroupID != 0`):

- event ditahan sampai `RepeatEnd=true`
- backend hitung total efektif combo
- rule dipicu sekali dengan `{repeat_count}` final

Tujuannya supaya command tidak dieksekusi berkali-kali untuk combo yang sama.

## Event List Box (UI)

- menampilkan event bertipe `gift` saja
- auto slide
- pagination + tombol `Prev/Next`
- layout slide saat ini: grid `5 x 4` (20 card/slide)
- tombol `Save PNG Slides` untuk export gambar slide

## Endpoint API

### Halaman dan State

- `GET /`
- `GET /state`
- `POST /start`
- `POST /stop`
- `GET /events` (SSE)

### Event Rule

- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`
- `GET /api/events/export`
- `POST /api/events/load`
- `POST /api/events/reset`
- `POST /api/events/test/{id}`

### Gift dan Asset

- `GET /api/gifts`
- `POST /api/gifts/refresh`
- `POST /api/upload/sound`
- `GET /giftimage/...`
- `GET /static/...`

### Minecraft RCON

- `GET /api/minecraft/rcon/status`
- `POST /api/minecraft/rcon/connect`
- `POST /api/minecraft/rcon/disconnect`
- `POST /api/minecraft/rcon/command`

### Simulator

- `POST /api/test/event`
- `POST /api/test/gift` (alias ke handler yang sama)

`/api/test/event` mendukung tipe:

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

## Gift Refresh Source Fallback

`/api/gifts/refresh` memakai urutan fallback:

1. `live_room` (via room aktif)
2. `web_fallback` (webcast gift list)
3. `local_cache` (`gift-list.json` lokal)

Response juga mengembalikan metadata `source`, `region`, `room_id`.

## RCON dan Keyboard Shortcut

- RCON config default dibaca dari `server/server.properties`.
- Bisa override manual dari dashboard (`host`, `port`, `password`) saat connect.
- `mc_command` bisa multi-line, backend eksekusi per baris non-kosong.
- Keyboard shortcut hanya didukung di Windows (`runtime.GOOS == windows`).

## License Gate (Penting)

Endpoint `POST /start` melakukan validasi username ke allowlist remote:

- default source:
  - `https://raw.githubusercontent.com/zufarrizal/akses-go/refs/heads/main/username.txt`
- cache TTL: 30 detik
- jika gagal/tidak terdaftar -> `403` dengan pesan pembelian license

Artinya, tracker live tidak akan start sebelum username lolos allowlist.

## Testing

Jalankan test Go:

```bash
go test ./...
```

Test tanpa live TikTok:

- pakai panel `Event Simulator` di UI
- atau panggil endpoint `/api/test/event`
- atau tombol `Run` pada event row (`/api/events/test/{id}`)

## Catatan Data Runtime

File/folder berikut akan sering berubah saat aplikasi berjalan:

- `events.json`
- `gift-list.json`
- `giftimage/`
- `sounds/`

Saran:

- backup berkala file konfigurasi penting
- jika event gift gagal dibuat, pastikan `gift-list.json` sudah ter-refresh
- jika aksi command gagal, cek status RCON di dashboard

## Dependency Management

- Project ini memakai Go Modules (`go.mod` + `go.sum`).
- Folder `vendor/` tidak wajib ada di root untuk penggunaan normal.
- Gunakan `go mod vendor` hanya jika memang butuh mode vendor (misalnya build offline atau kebijakan CI tertentu).
