# GoTik

Bridge TikTok Live events to Minecraft actions using:
- Go backend (`main.go`)
- Web dashboard (`web/`)
- Skript automation (`Server/plugins/Skript/scripts/`)

## Features

- Track TikTok live events
- Map gifts/events to Minecraft commands (via RCON)
- Web UI for event rules and testing
- Skript game rules (tools, diamond economy, scoreboard, auto effects)
- Auto diamond armor + starter tools on join/respawn
- Configurable diamond win target and global win counter
- Broadcast item/event commands such as diamonds and enchanted golden apples

## Project Structure

- `main.go` - backend server and TikTok event handling
- `web/` - frontend dashboard
- `Server/` - Minecraft server files
- `Server/plugins/Skript/scripts/` - gameplay scripts

## Requirements

- Go 1.22+ (or compatible with `go.mod`)
- Java + Paper/Spigot server
- Skript plugin installed
- RCON enabled in `Server/server.properties`

## Run

1. Start Minecraft server (inside `Server/`).
2. Run Go backend from project root:

```bash
go run .
```

3. Open dashboard:

```text
http://localhost:8080
```

## Important Skript Files

- `Tools.sk` - auto gear loadout and protection
- `Armor.sk` - auto diamond armor loadout on join/respawn
- `Pickaxe.sk` - 3x3x3 mining behavior
- `DiamondOnly.sk` - inventory filter and diamond-only pickup rules
- `Scoreboard.sk` - diamond balance, configurable target, win countdown, global win counter
- `Nightvision.sk` - permanent night vision
- `Bedrock.sk` - bedrock automation logic with reduced fill spam
- `Survival.sk` - gift/event command actions and broadcast reward commands

## Gameplay Commands

- `/dm <amount> <name> <repeat>` - give diamonds to all players
- `/gap <amount> <name> <repeat>` - give enchanted golden apples to all players
- `/dmset <amount>` - change the diamond win target (default: `100`)
- `/dmin <amount>` - reduce a player's diamond balance
- `/winreset` - reset the global `WIN` counter
- `/tools` - reapply starter tools
- `/armor` - reapply diamond armor

## Notes

- Runtime-generated files are ignored by `.gitignore` (logs, worlds, binaries, etc.).
- If this folder is not yet a Git repository, initialize it with:

```bash
git init
```
