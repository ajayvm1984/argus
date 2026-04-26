# CURRENT_WORK.md — Argus Project

**Last Updated:** 2026-04-27 02:25 GMT+4
**Status:** Module 1 Docker scaffold running on Mac Docker (7/7 services up)

---

## Active Work

### Module 1: Docker Compose Scaffold (IN PROGRESS — DEV TESTING)
**Running on:** Mac Docker Desktop (Mac mini at home)
**Goal:** Validate full stack before Oracle Cloud VM is available

**Status:**
```
✅ argus-db      — TimescaleDB (5432)
✅ argus-api     — Node/Express API (8080, health OK)
✅ argus-ui      — React/Vite UI (port 80 via nginx)
✅ argus-nginx   — Reverse proxy (port 80/443)
✅ argus-zabbix  — Zabbix server (10051)
✅ argus-keycloak — Keycloak IAM (8080/8443)
✅ argus-ntopng  — ntopng (3000, admin:admin)
```

**Fixes applied tonight:**
- TypeScript errors in api/src/index.ts (removed req.params[0] broken routing)
- Created missing routes: alerts.ts, devices.ts
- Fixed schema.ts Drizzle table definitions
- Fixed ui/Dockerfile: `npm install --omit=dev`
- Fixed alert-dispatcher/Dockerfile
- Fixed nginx.conf (stripped SSL, removed broken upstream references)
- Fixed ntopng image: ntop/ntopng:latest (arm64 compatible)
- Disabled alert-dispatcher (Twilio not configured yet)

---

## Next Actions

### Priority 1: Oracle Cloud VM (BLOCKED — no capacity in Dubai)
- LaunchAgent `~/Library/LaunchAgents/com.argus.vm-retry.plist` running every 30 min
- Waiting for host capacity to free up
- **DO NOT attempt to create VM in Dubai** — confirmed exhausted

### Priority 2: Hetzner Cloud (fallback)
- Script ready: `~/bin/argus-vm-provision.sh`
- Requires `HETZNER_API_TOKEN` env var
- Ask Ajay for Hetzner API token when he's awake

### Module 2: Zabbix Crawler
- Poll Zabbix API every 5 minutes for new hosts
- Parse host groups, templates, items, triggers
- Write to TimescaleDB (argus-db)
- **api/src/services/crawler.ts** — TODO: implement

### Module 3: Keycloak Auth
- Keycloak is running but not yet integrated with API
- API currently returns 401 for all /api/* routes
- **api/src/middleware/auth.ts** — needs JWT validation against Keycloak

---

## Infrastructure Decisions

- **Mac Docker for dev testing**: Fully operational
- **Oracle Cloud Dubai**: Exhausted, do not attempt VM creation
- **Hetzner**: Backup cloud option, awaiting API token
- **All fixes pushed to GitHub**: commit `78e29c8`

---

## Known Issues

1. API `/api/*` returns 401 Unauthorized — auth middleware needs Keycloak JWT validation
2. Zabbix web UI needs admin credentials (not configured in nginx yet)
3. ntopng password is `admin` (hardcoded in docker-compose)
4. No SSL/HTTPS configured for dev (nginx config stripped)
5. Alert dispatcher disabled — needs Twilio credentials

---

## Recovery

Trigger phrase: **"continue with Argus"** (lowercase)
Repo: https://github.com/ajayvm1984/argus
Latest commit: `78e29c8`