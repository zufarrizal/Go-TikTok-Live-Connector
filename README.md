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
- `Pickaxe.sk` - 3x3x3 mining behavior
- `DiamondOnly.sk` - diamond-only pickup rules
- `Scoreboard.sk` - diamond balance, debt, max cap, win countdown
- `Nightvision.sk` - permanent night vision
- `Bedrock.sk` - bedrock automation logic
- `Survival.sk` - gift/event command actions

## Notes

- Runtime-generated files are ignored by `.gitignore` (logs, worlds, binaries, etc.).
- If this folder is not yet a Git repository, initialize it with:

```bash
git init
```
