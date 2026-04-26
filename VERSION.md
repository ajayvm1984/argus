# VERSION.md — Environment

**Last Updated:** 2026-04-27 02:27 GST

---

## OpenClaw

- **Version:** v2026.4.24 (cbcfdf6)
- **Model:** minimax/MiniMax-M2.7 (default), anthropic/claude-sonnet-4-6 (fallback)
- **Config:** `~/.openclaw/openclaw.json`
- **Update:** Manual only — does NOT auto-update

---

## Development Tools

| Tool | Version | Location |
|------|---------|----------|
| GitHub CLI (`gh`) | v2.63.2 | ~/bin/gh |
| Docker CLI | v29.4.0 | /Volumes/Docker/Docker.app/Contents/Resources/bin/docker |
| Docker Compose | v5.1.3 | ~/bin/docker-compose |
| Node.js | (system) | |
| Python | 3.x | /usr/bin/python3 |
| pymupdf | available | for PDF reading |

---

## Installed Binaries

- `~/bin/gh` — GitHub CLI
- `~/bin/docker` → symlink to Docker.app
- `~/bin/dockerd` → symlink to Docker.app  
- `~/bin/docker-compose` — Docker Compose v5.1.3
- `/Users/claw/Applications/platform-tools/adb` — Android Debug Bridge
- `/Volumes/Docker/Docker.app` — Docker Desktop app

---

## GitHub

- **Account:** ajayvm1984
- **Repo:** https://github.com/ajayvm1984/argus
- **Transfer target:** meridiancyber/argus (when org created)

---

## Environment Variables (for Argus build)

```
DOCKER_HOST=unix:///Users/claw/.docker/run/docker.sock
PATH includes: ~/bin
GITHUB_TOKEN=(from gh auth, stored in keyring)
```

---

## Oracle Cloud

- **Account:** jothebot2026@gmail.com
- **Cloud account name:** jothebot2026
- **VM target:** Ubuntu 22.04 LTS, Always Free ARM

---

## macOS

- **User:** claw (primary), ajaymathai (admin)
- **Keychain:** All credentials stored via `security add-generic-password`
- **Homebrew:** /opt/homebrew (ownership issue — sudo not working from exec)
- **Docker Desktop:** Running with Linux VM

---

*Update this file when versions change.*
