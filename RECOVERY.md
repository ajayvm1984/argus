# RECOVERY.md — Argus Build State

**Last Updated:** 2026-04-27 02:26 GST
**Last Session By:** Jo (AI Assistant)
**Trigger Phrase:** "Continue with Argus"

---

## Project Overview

**Product:** Argus — Network Monitoring Platform for MSPs
**Owner:** Meridian Cyber / Ajay Mathai (ajay@meridiancyber.ai)
**License:** Proprietary — commercial product
**Repo:** https://github.com/ajayvm1984/argus (transfer to meridiancyber org when created)
**Stack:** Ubuntu 22.04, Docker Compose, React + TypeScript + Tailwind, Node.js Express, PostgreSQL/TimescaleDB, Zabbix 7.2, ntopng, Keycloak 22.x, Twilio, Keygen.sh

---

## Current Build State

**Module 0 — Setup (IN PROGRESS)**
- [x] GitHub repo created (ajayvm1984/argus)
- [x] Recovery files created
- [ ] Oracle Cloud VM not yet built
- [ ] Docker Hub login not yet verified

**Modules 1-9 — NOT STARTED**

---

## Module Sequence (Agreed)

1. **Module 1:** Repo + Docker Compose + env scaffold
2. **Module 2:** Database schema (Drizzle ORM migrations)
3. **Module 3:** API gateway core (tenant/device/site CRUD)
4. **Module 4:** Zabbix integration (device sync + metrics)
5. **Module 5:** ntopng integration (flow data)
6. **Module 6:** License daemon (Keygen.sh)
7. **Module 7:** Alert dispatcher (Twilio WhatsApp/SMS/Email)
8. **Module 8:** React UI (7 pages: Dashboard, Sites, Devices, DeviceDetail, Topology, Alerts, Reports, Configuration)
9. **Module 9:** Install wizard + documentation (INSTALL.md, ADMIN.md, TROUBLESHOOT.md, API.md)

---

## Decisions Made

| Decision | Value |
|----------|-------|
| OS | Ubuntu 22.04 LTS |
| Install wizard | Browser-based at /setup |
| Zabbix/ntopng | Bundled in Docker Compose |
| License | Proprietary, Keygen.sh validation |
| Alert channels | WhatsApp → SMS → Email (Twilio) |
| VM per customer | Oracle Cloud Always Free (ARM Ampere) |
| Air-gap handling | Email-only alerts, manual license activation |

---

## Third-Party Accounts

| Service | Account | Status |
|---------|---------|--------|
| GitHub | ajayvm1984 | ✅ Authenticated |
| Oracle Cloud | jothebot2026@gmail.com | ✅ Account created |
| Docker Hub | jothebot2026 | ✅ Account created |
| Twilio | (not yet) | ⏳ Needed for Module 7 |
| Keygen.sh | (not yet) | ⏳ Needed for Module 6 |

---

## Credentials Stored

All in macOS Keychain:
- `mac_admin_ajaymathai` — ajaymathai / evaroseajay (project-only)
- `dockerhub_creds` — jothebot2026 / claw@DEShc$1984
- `github_pat_argus` — $GITHUB_TOKEN
- `uptime_kuma_creds` — uptime kuma password

---

## Next Action

**IMMEDIATE:** Build Oracle Cloud VM, then start Module 1.

Oracle Cloud credentials needed:
- Tenancy OCID
- User OCID
- API Token (or auth token)

---

## If I Go Dark

1. Read this file
2. Read CURRENT_WORK.md
3. Read MEMORY.md
4. Check VERSION.md for environment
5. Resume from next action

**Source of truth:** This GitHub repo.

## Updated: 2026-04-27 02:58 GST

### Recent Progress
- Module 1 pushed to GitHub: docker-compose.yml, API gateway, database schema
- All credentials stored in Keychain
- LaunchAgent set up to retry Oracle Cloud VM every 30 minutes
- Docker Hub login confirmed working

### What's Built So Far
- docker-compose.yml (full stack: nginx, ui, api, alert-dispatcher, keycloak, zabbix, ntopng, postgres)
- API routes: tenants, sites, devices, alerts, reports, health
- Database schema (Drizzle ORM): tenants, sites, devices, alert_rules, alert_deliveries, license_state
- Alert dispatcher: skeleton with Zabbix polling
- Install script for Ubuntu 22.04

### Next Steps
1. Wait for Oracle Cloud VM (automatic retry every 30 min)
2. Complete UI scaffold (React)
3. Test full stack on Mac Docker
4. Module 2: Database migrations

### VM Retry
- LaunchAgent: ~/Library/LaunchAgents/com.argus.vm-retry.plist
- Script: ~/bin/argus-vm-retry.sh
- Log: ~/argus-vm-retry.log

