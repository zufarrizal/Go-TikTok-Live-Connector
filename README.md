# Go-TikTok-Live-Connector

Bridge event TikTok Live ke command Minecraft lewat Go, Web UI, dan Skript.

Project ini berisi 3 bagian utama:

- Backend Go untuk menerima event TikTok Live, menyimpan rule event, dan mengirim command ke Minecraft via RCON.
- Dashboard web untuk connect ke TikTok, kelola event, upload sound, test event, dan kontrol RCON.
- Folder `server/` berisi Paper server + Skript gameplay yang dipakai untuk menjalankan automation di Minecraft.

## Ringkasan Alur

1. Jalankan server Paper Minecraft.
2. Jalankan backend Go.
3. Buka dashboard di `http://localhost:8080`.
4. Connect ke username TikTok Live.
5. Backend akan:
   - subscribe ke event live TikTok
   - download katalog gift
   - simpan daftar gift ke `gift-list.json`
   - download gambar gift ke folder `giftimage/`
6. Event TikTok yang cocok dengan rule di `events.json` akan diubah menjadi command Minecraft dan dikirim lewat RCON.
7. Skript di server Minecraft menangani command seperti pemberian item, summon mob, scoreboard, inventory whitelist, dan auto clear drops.

## Teknologi Yang Dipakai

- Go `1.25.0`
- `github.com/steampoweredtaco/gotiktoklive`
- `github.com/gorcon/rcon`
- HTML, CSS, vanilla JavaScript
- PaperMC + plugin Skript

## Struktur Proyek

- `main.go`
  Backend utama. Menyediakan web server, SSE event stream, CRUD event rule, koneksi TikTok Live, koneksi RCON, upload sound, dan event simulator.
- `events.json`
  Database rule event yang akan dijalankan otomatis.
- `gift-list.json`
  Daftar gift TikTok hasil fetch dari room live terakhir.
- `giftimage/`
  Cache gambar gift. Nama file mengikuti pola `<diamond>_<gift name>.<ext>`, misalnya `1_Blow a kiss.webp`.
- `web/index.html`
  Tampilan dashboard.
- `web/static/app.js`
  Logika frontend dashboard.
- `web/static/styles.css`
  Styling dashboard.
- `web/static/sounds/`
  Sound effect yang bisa dipakai oleh event.
- `server/`
  Folder Paper server yang dipakai proyek ini.

## Fitur Backend

- Start dan stop tracker TikTok Live dengan username.
- Auto reconnect ketika live terputus.
- SSE stream realtime di `/events` untuk history dashboard.
- Simpan rule event ke `events.json`.
- Trigger command Minecraft via RCON.
- Download gift catalog dan image gift ke lokal.
- Upload file sound ke `web/static/sounds/`.
- Simulator event lokal untuk test tanpa live TikTok.

## Tipe Event Yang Didukung

Rule event yang valid di backend:

- `gift`
- `join`
- `follow`
- `comment`
- `like`
- `share`

Normalisasi event dari TikTok:

- `GiftEvent` -> `gift`
- `UserEvent JOIN` -> `join`
- `UserEvent FOLLOW` -> `follow`
- `UserEvent SHARE` -> `share`
- `ChatEvent` -> `comment`
- `LikeEvent` -> `like`

## Cara Rule Event Bekerja

Setiap item di `events.json` memiliki bentuk seperti ini:

```json
{
  "id": 1,
  "type": "gift",
  "label": "",
  "gift_id": 10716,
  "gift_name": "Blow a kiss",
  "diamond": 1,
  "sound_url": "/static/sounds/faaah.mp3",
  "mc_command": "tnt 10 {username} {repeat_count}"
}
```

Field penting:

- `type`
  Jenis trigger event.
- `label`
  Dipakai sebagai filter tambahan untuk tipe tertentu.
- `gift_id`
  Khusus `gift`, harus cocok dengan gift TikTok.
- `gift_name`
  Nama gift untuk tampilan.
- `diamond`
  Nilai diamond gift untuk tampilan.
- `sound_url`
  Sound yang akan diputar di dashboard saat trigger berhasil.
- `mc_command`
  Command Minecraft yang dikirim via RCON setelah placeholder diganti.

## Aturan `label`

- Untuk `comment`, `label` dicocokkan sebagai substring terhadap isi komentar.
- Untuk `like`, `label` harus berupa angka dan harus sama persis dengan jumlah like event saat itu.
- Untuk tipe lain, `label` boleh kosong dan umumnya tidak dipakai sebagai filter.

## Placeholder Yang Tersedia

Frontend dan backend saat ini mendukung placeholder berikut:

- `{event_type}`
- `{username}`
- `{nickname}`
- `{comment}`
- `{likes}`
- `{total_likes}`
- `{gift_name}`
- `{gift_id}`
- `{diamond}`
- `{repeat_count}`

Contoh:

```text
tnt 10 {username} {repeat_count}
ttchat {username} {comment}
join {username} {follow}
```

Catatan:

- Beberapa rule lama di `events.json` masih memakai `{repeat}`. Backend aktif memakai `{repeat_count}`, jadi sebaiknya samakan semua rule ke placeholder itu.

## Perilaku Gift Combo

Backend punya penanganan khusus untuk grouped gift combo:

- event combo tidak langsung diproses pada setiap tick combo
- backend menunggu `RepeatEnd`
- nilai `{repeat_count}` yang dipakai adalah total efektif combo akhir

Ini mencegah command Minecraft jalan berkali-kali untuk satu combo gift yang sama.

## Dashboard Web

Halaman utama berada di `http://localhost:8080` dan berisi:

- Connect / Stop TikTok tracker
- Minecraft Connector untuk RCON
- Event Simulator
- Event Panel untuk CRUD rule event
- Event List Box untuk menampilkan card event gift
- History panel realtime dari SSE `/events`

### Event Panel

- Menampilkan seluruh event dari `events.json`
- Aksi `Run`, `Edit`, `Delete`
- Tombol `Add Event`
- Bisa upload sound langsung dari form event

### Event List Box

Section ini mengambil data dari `events.json`, tetapi hanya menampilkan event `gift`.

Karakteristiknya saat ini:

- berada di bawah `Event Panel`
- tampil dalam bentuk box/card gift
- 1 baris berisi 6 item
- 2 baris per slide
- auto slide per halaman
- hanya event gift yang tampil
- gambar gift diambil dari folder `/giftimage/`
- ada tombol `Popup`

Selain itu, gift yang sudah dipakai pada event `gift` lain akan disembunyikan dari picker saat `Add Event`, agar satu gift ID tidak dipakai dua kali. Saat edit, gift milik event yang sedang diedit tetap ditampilkan.

### Event Simulator

Simulator frontend dapat mengirim test event untuk:

- `gift`
- `chat`
- `user_join`
- `user_follow`
- `user_share`
- `like`

Endpoint backend test juga mendukung beberapa tipe tambahan internal seperti `room`, `viewers`, `question`, `control`, `mic_battle`, `battles`, `room_banner`, dan `intro`, tetapi UI saat ini fokus pada event yang paling sering dipakai.

## Endpoint HTTP Yang Tersedia

### Halaman dan stream

- `GET /`
  Dashboard utama.
- `GET /state`
  Status tracker TikTok saat ini.
- `POST /start`
  Mulai tracking TikTok username.
- `POST /stop`
  Stop tracking.
- `GET /events`
  Server-Sent Events realtime untuk history dashboard.

### Event rules

- `GET /api/events`
  List seluruh rule event.
- `POST /api/events`
  Tambah rule event baru.
- `PUT /api/events/{id}`
  Update rule event.
- `DELETE /api/events/{id}`
  Hapus rule event.
- `POST /api/events/test/{id}`
  Jalankan test untuk satu rule event tertentu via RCON.

### Gift dan asset

- `GET /api/gifts`
  Ambil isi `gift-list.json`.
- `POST /api/upload/sound`
  Upload audio ke `web/static/sounds/`.
- `GET /giftimage/...`
  Serve gambar gift lokal.
- `GET /static/...`
  Serve asset web dan sound.

### Minecraft RCON

- `GET /api/minecraft/rcon/status`
- `POST /api/minecraft/rcon/connect`
- `POST /api/minecraft/rcon/disconnect`
- `POST /api/minecraft/rcon/command`

### Simulator

- `POST /api/test/event`
- `POST /api/test/gift`

## Konfigurasi Minecraft

Konfigurasi RCON saat ini dibaca dari `server/server.properties`.

Nilai penting yang aktif sekarang:

- `enable-rcon=true`
- `rcon.port=25575`
- `rcon.password=123`
- `server-port=25565`
- `gamemode=survival`
- `max-players=2`
- `online-mode=false`

Backend juga bisa connect manual ke RCON dari dashboard jika host, port, atau password ingin diubah tanpa edit file lebih dulu.

## Skript Aktif Di Server

Folder utama:

- `server/plugins/Skript/scripts/`

Script yang aktif dan relevan untuk gameplay:

- `Armor.sk`
  Memberi iron armor ber-enchant saat join/respawn, memastikan armor selalu ada, dan menyediakan command `/armor`.
- `Tools.sk`
  Memberi starter tools utama:
  - netherite pickaxe
  - netherite sword
  - bow
  - 64 arrow
  - shield di offhand
  Script ini juga menjaga slot tools tetap ada dan mencegah item inti dibuang. Command manual: `/tools`.
- `Food.sk`
  Menjaga hunger dan saturation selalu penuh.
- `Nightvision.sk`
  Memberi efek night vision permanen.
- `Pickaxe.sk`
  Pickaxe menambang area `3x3x3` sekaligus dan menjatuhkan drop tiap block yang dihancurkan.
- `DiamondOnly.sk`
  Inventory whitelist. Hanya item berikut yang boleh tetap ada:
  - diamond
  - enchanted golden apple
  - armor
  - tools
  - bow, crossbow, trident, fishing rod, shears, shield, arrow
  Item lain akan dibersihkan dari inventory secara periodik dan pickup item lain dari ground akan dibatalkan.
- `ClearDrops.sk`
  Menghapus dropped item di tanah secara berkala, kecuali item whitelist dari `DiamondOnly.sk`. Command manual: `/cleardrops`.
- `Scoreboard.sk`
  Mengelola diamond balance, target kemenangan, debt diamond, countdown win 15 detik, dan total win global di sidebar scoreboard.
- `Survival.sk`
  Berisi command gameplay yang umumnya dipanggil dari event TikTok.

## Command Gameplay Penting

### Reward / info

- `/dm <amount> <name> <repeat>`
  Memberi diamond ke semua pemain sebesar `amount * repeat`.
- `/ega <amount> <name> <repeat>`
  Memberi enchanted golden apple ke semua pemain sebesar `amount * repeat`.
- `/join <username> <follow>`
  Broadcast TikTok user join ke chat Minecraft.
- `/follow <username>`
  Broadcast TikTok user follow ke chat Minecraft.
- `/ttchat <username> : <comment>`
  Broadcast comment TikTok ke chat Minecraft.

### Diamond win system

- `/dmin <amount>`
  Mengurangi diamond balance pemain, bisa sampai negatif melalui debt.
- `/dmset <amount>`
  Set target diamond untuk menang.
- `/winreset`
  Reset total win global ke 0.
- `/winset <amount>`
  Set total win global.
- `/addwin <amount>`
  Tambah total win global.
- `/minwin <amount>`
  Kurangi total win global.

### Combat / chaos commands dari `Survival.sk`

Contoh command yang tersedia:

- `/tnt <amount> <name> <repeat>`
- `/tntrain <amount> <name> <repeat>`
- `/tntprison <amount> <name> <repeat>`
- `/nightmare <amount> <name> <repeat>`
- `/zombie <amount> <name> <repeat>`
- `/skeleton <amount> <name> <repeat>`
- `/spider <amount> <name> <repeat>`
- `/creeper <amount> <name> <repeat>`
- `/witch <amount> <name> <repeat>`
- `/wither <amount> <name> <repeat>`
- `/warden <amount> <name> <repeat>`
- `/blaze <amount> <name> <repeat>`
- `/enderman <amount> <name> <repeat>`

Selain itu ada banyak command summon lain seperti `bogged`, `breeze`, `creaking`, `elderguardian`, `ghast`, `guardian`, `hoglin`, `husk`, `magmacube`, `parched`, `phantom`, `piglinbrute`, `pillager`, `shulker`, `silverfish`, `slime`, `stray`, `vex`, `vindicator`, `zoglin`, `zombievillager`, dan lainnya.

## File Data Yang Perlu Diperhatikan

- `events.json`
  Rule event aktif.
- `gift-list.json`
  Data gift terbaru hasil sinkronisasi dari live TikTok.
- `giftimage/`
  Gambar gift yang dipakai `Event List Box`.
- `web/static/sounds/`
  Audio trigger event.
- `server/plugins/Skript/variables.csv`
  Penyimpanan variable Skript seperti target diamond dan total win.

## Cara Menjalankan

### 1. Jalankan Minecraft server

Dari folder `server/`, jalankan Paper server seperti biasa, misalnya lewat file batch yang Anda pakai.

### 2. Jalankan backend Go

Dari root project:

```bash
go run .
```

Backend akan listen di:

```text
http://localhost:8080
```

### 3. Buka dashboard

Masuk ke browser:

```text
http://localhost:8080
```

### 4. Connect TikTok

- isi username TikTok
- klik `Connect`

Saat berhasil connect, backend akan mencoba fetch katalog gift dan mengunduh gambar ke `giftimage/`.

## Testing

Untuk test Go:

```bash
go test ./...
```

Untuk test rule event tanpa live TikTok:

- gunakan `Event Simulator` di dashboard
- atau panggil endpoint `/api/test/event`
- atau jalankan `Run` pada salah satu rule di `Event Panel`

## Catatan Penting

- Repository ini menyimpan source code sekaligus folder server Paper yang aktif.
- Banyak file di `server/` adalah data runtime Minecraft, world, plugin data, dan log.
- Folder `giftimage/` dan `web/static/sounds/` adalah cache/asset runtime yang memang dipakai langsung oleh dashboard.
- Dashboard mengandalkan `gift-list.json`; daftar gift baru akan paling akurat setelah backend berhasil connect ke live TikTok dan sinkronisasi gift selesai.
- Untuk command Minecraft yang dikirim dari event, RCON harus benar-benar connected.

## Rekomendasi Perawatan

- Samakan semua template command ke placeholder `{repeat_count}`.
- Backup `events.json`, `gift-list.json`, dan `server/plugins/Skript/variables.csv` secara berkala.
- Jika Event List Box tampak kosong, cek apakah:
  - `events.json` punya event dengan `type: "gift"`
  - folder `giftimage/` berisi gambar yang sesuai
  - browser sudah di-refresh

