# Minecraft Server (Paper + Skript)

Dokumen ini menjelaskan cara menjalankan server dan daftar command Skript yang aktif saat ini.

## Prasyarat

- Java (sesuai kebutuhan `paper.jar`, umumnya Java 21 untuk Paper terbaru)
- Windows (karena startup script menggunakan `.bat`)

## Cara Menjalankan

1. Buka folder `server/`.
2. Jalankan `start-server.bat`.
3. Tunggu sampai server selesai boot.

## Penting

- `start-server.bat` akan menghapus folder `world`, `world_nether`, dan `world_the_end` sebelum server start.
- Artinya setiap start dari script ini akan reset map.
- Jika ingin simpan world, jalankan `paper.jar` tanpa langkah hapus world.

Isi `start-server.bat` saat ini:

```bat
@echo off
rmdir /s /q world 2>nul
rmdir /s /q world_nether 2>nul
rmdir /s /q world_the_end 2>nul
java -Xms4G -Xmx4G -jar paper.jar --nogui
pause
```

## Keterangan Parameter Command

- `<number>`: angka
- `<text>`: teks (username/label/pesan)
- Pola `<number> <text> <number>` berarti total = arg1 x arg3

## Command Utility TikTok

- `/join <text>`
- `/follow <text>`
- `/ttchat <text> <text>`

## Command Item dan Equipment

- `/dmplus <number> <text> <number>`
- `/dmmin <number> <text> <number>`
- `/ega <number> <text> <number>`
- `/armor`
- `/tools`
- `/cleardrops`

## Command Scoreboard dan Win

- `/dmset <number>`
- `/winreset`
- `/setwintarget <number>`
- `/addwintarget <number>`
- `/minwintarget <number>`
- `/winset <number>`
- `/addwin <number> <text> <number>`
- `/minwin <number> <text> <number>`
- `/reducewin <number> <text> <number>`
- `/winmin <number> <text> <number>`

## Command Trap dan Chaos

- `/spidertrap <number> <text> <number>`
- `/lavatrap <number> <text> <number>`
- `/tnt <number> <text> <number>`
- `/tntrain <number> <text> <number>`
- `/tntprison <number> <text> <number>`
- `/nightmare <number> <text> <number>`

## Command Summon Mob

Semua command di bawah memakai format:
`/<mob> <number> <text> <number>`

- `/zombie`
- `/skeleton`
- `/spider`
- `/creeper`
- `/witch`
- `/wither`
- `/enderman`
- `/blaze`
- `/witherskeleton`
- `/evoker`
- `/ravager`
- `/bogged`
- `/breeze`
- `/creaking`
- `/elderguardian`
- `/endermite`
- `/ghast`
- `/guardian`
- `/hoglin`
- `/husk`
- `/magmacube`
- `/parched`
- `/phantom`
- `/piglinbrute`
- `/pillager`
- `/shulker`
- `/silverfish`
- `/slime`
- `/stray`
- `/vex`
- `/vindicator`
- `/warden`
- `/zoglin`
- `/zombievillager`
- `/cavespider`
- `/drowned`
- `/piglin`
- `/zombifiedpiglin`

## File Skript Aktif

Lokasi: `server/plugins/Skript/scripts/`

- `AllPlayersEffects.sk`
- `Armor.sk`
- `Bedrock.sk`
- `ClearDrops.sk`
- `DeathRespawn.sk`
- `DiamondOnly.sk`
- `Food.sk`
- `KeepGap.sk`
- `Nightvision.sk`
- `Pickaxe.sk`
- `Scoreboard.sk`
- `Settings.sk`
- `Survival.sk`
- `SwordReach.sk`
- `Tools.sk`
- `WinTeleportTopY.sk`

## Reload Skript

- Reload satu file: `/sk reload <nama_file>`
- Reload semua file: `/sk reload all`
