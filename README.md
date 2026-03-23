# Go-TikTok-Live-Connector

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
- Auto full hunger for all players
- Custom Diamond Compass on join/respawn
- Configurable diamond win target and global win counter
- Broadcast item/event commands such as diamonds and enchanted golden apples

## Current Project Structure

- `main.go` - Go backend server and TikTok event bridge
- `go.mod`, `go.sum` - Go module metadata
- `events.json` - event rule configuration
- `gift-list.json` - TikTok gift mapping data
- `web/index.html` - dashboard page
- `web/static/app.js` - dashboard logic
- `web/static/styles.css` - dashboard styling
- `Server/` - Paper server directory used by the project

### Server Root

- `Server/paper.jar` - Paper server jar
- `Server/server.properties` - core server settings and RCON config
- `Server/start-server.bat` - server startup script
- `Server/ops.json` - operator list
- `Server/bukkit.yml`, `Server/spigot.yml`, `Server/commands.yml`, `Server/help.yml`, `Server/permissions.yml` - Bukkit/Paper configuration
- `Server/version_history.json`, `Server/usercache.json`, `Server/banned-players.json`, `Server/banned-ips.json`, `Server/whitelist.json` - runtime server data
- `Server/config/` - Paper global/world default config
- `Server/plugins/` - installed plugins and plugin data
- `Server/logs/` - server logs
- `Server/world/`, `Server/world_nether/`, `Server/world_the_end/` - world data
- `Server/cache/`, `Server/libraries/`, `Server/versions/` - server runtime dependencies

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

## Skript Files In Use

- `Server/plugins/Skript/scripts/Armor.sk` - auto diamond armor loadout on join/respawn
- `Server/plugins/Skript/scripts/Bedrock.sk` - bedrock floor automation around moving players
- `Server/plugins/Skript/scripts/DiamondOnly.sk` - inventory whitelist and diamond pickup rules
- `Server/plugins/Skript/scripts/Food.sk` - keeps hunger and saturation full
- `Server/plugins/Skript/scripts/Nightvision.sk` - permanent night vision
- `Server/plugins/Skript/scripts/Pickaxe.sk` - 3x3x3 mining behavior
- `Server/plugins/Skript/scripts/Scoreboard.sk` - diamond progress sidebar, win counter, target management
- `Server/plugins/Skript/scripts/Survival.sk` - reward commands and mob spawn commands
- `Server/plugins/Skript/scripts/Tools.sk` - starter tools and tool protection

## Bundled Skript Plugin Files

- `Server/plugins/Skript/config.sk` - Skript plugin config
- `Server/plugins/Skript/features.sk` - Skript feature toggles
- `Server/plugins/Skript/variables.csv` - persisted Skript variables
- `Server/plugins/Skript/backups/` - variable backups
- `Server/plugins/Skript/lang/` - Skript language files
- `Server/plugins/Skript/scripts/-examples/` - bundled example scripts, kept for reference

## Gameplay Commands

- `/dm <amount> <name> <repeat>` - give diamonds to all players
- `/ega <amount> <name> <repeat>` - give enchanted golden apples to all players
- `/dmset <amount>` - change the diamond win target (default: `100`)
- `/dmin <amount>` - reduce a player's diamond balance
- `/winset <amount>` - set the global `WIN` counter
- `/addwin <amount>` - add to the global `WIN` counter
- `/minwin <amount>` - subtract from the global `WIN` counter
- `/winreset` - reset the global `WIN` counter
- `/tools` - reapply starter tools
- `/armor` - reapply diamond armor
- mob/event commands in `Survival.sk` - e.g. `/chicken`, `/zombie`, `/warden`, `/wither`, `/nightmare`, `/tnt`

## Notes

- The repository currently contains both source files and a live Paper server directory.
- Many files under `Server/` are runtime-generated server data, plugin data, logs, and world files.
- The active gameplay logic is mainly in `Server/plugins/Skript/scripts/`.
- If this folder is not yet a Git repository, initialize it with:

```bash
git init
```
