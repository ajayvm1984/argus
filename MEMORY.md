# MEMORY.md — Argus Project Knowledge

**Last Updated:** 2026-04-27 02:27 GST

---

## The Product — Argus

**What it is:** A network monitoring platform for MSPs (Managed Service Providers). Customers install it on their own VM, it monitors their network via SNMP (Zabbix) and NetFlow (ntopng), and sends alerts via WhatsApp/SMS/Email (Twilio).

**Why it exists:** Ajay designed it to be a commercial product. He has a spec document (48-page PDF) and wants to monetize it.

**Who pays:** Other businesses (restaurants, hotels, offices) who need network monitoring but don't have IT staff.

---

## Technical Spec Highlights

### Stack
- **VM:** Ubuntu 22.04 LTS (single VM per customer)
- **Container:** Docker Compose (all-in-one)
- **UI:** React 18 + TypeScript + Vite + Tailwind CSS
- **API:** Node.js + Express
- **Auth:** Keycloak 22.x
- **Database:** PostgreSQL 16 + TimescaleDB 2.13 (two DBs: keycloak + argus/zabbix)
- **Monitoring:** Zabbix Server 7.2 LTS (SNMP polling)
- **Flow Analytics:** ntopng 6.x community (NetFlow/sFlow)
- **Alerts:** Node.js worker → Twilio (WhatsApp → SMS → Email)
- **License:** Keygen.sh (daily heartbeat, 30-day offline grace)
- **Proxy:** Nginx 1.25 (TLS termination)

### Data Models (Key Tables)
- `tenants` — MSP clients (slug, display_name, custom_domain, accent_color, logo_url, timezone)
- `sites` — Physical locations within tenant
- `devices` — Maps to Zabbix host IDs (display_name, device_type, vendor, model, primary_ip)
- `alert_rules` — Per-tenant alert config (thresholds, channels, recipients, quiet hours)
- `alert_deliveries` — Audit log of every alert dispatched
- `license_state` — Singleton for Keygen.sh validation

### Key Decisions
- Zabbix + ntopng **bundled in Docker Compose** (not separate installs)
- Install wizard: **browser-based at /setup** (not CLI)
- Devices mapped to Zabbix by `zabbix_host_id`
- ntopng provides: Top Talkers, Active Flows, NetFlow config
- Twilio: WhatsApp first, SMS fallback, Email fallback
- License: Keygen.sh, daily heartbeat, 30-day grace period

---

## Build Sequence

```
Step 1 → Repo + Docker Compose + env scaffold
Step 2 → Database schema (Drizzle migrations)  
Step 3 → API gateway core (auth + tenant/device/site CRUD)
Step 4 → Zabbix integration (device sync + metrics)
Step 5 → ntopng integration (flow data)
Step 6 → License daemon (Keygen.sh)
Step 7 → Alert dispatcher (Twilio)
Step 8 → React UI (7 pages)
Step 9 → Install wizard + documentation
```

---

## Ajay's Context

- **Name:** Ajay Mathai
- **Location:** Dubai, UAE
- **Company:** Meridian Cyber (meridiancyber.ai)
- **Background:** IT Director, 19 years experience, CCIE, CISSP, CISM
- **Role in this project:** Technical visionary, product owner, will sell and support
- **Non-technical** in coding — needs everything explained clearly
- **Paranoid** about things going wrong — needs recovery systems
- **Excited** about this project

### Ajay's Preferences
- Wants me to be **self-sufficient** — don't ask unless blocked
- Uses "B" to mean "OK" or "Option B"
- Recovery phrase: **"Continue with Argus"**
- All passwords in Keychain
- Wants video/screenshot walkthroughs for review

---

## Credentials

| Service | Username | Password | Location |
|---------|----------|----------|----------|
| Mac (ajaymathai) | ajaymathai | evaroseajay | Keychain |
| Docker Hub | jothebot2026 | claw@DEShc$1984 | Keychain |
| GitHub | ajayvm1984 | $GITHUB_TOKEN | Keychain |
| Oracle Cloud | jothebot2026@gmail.com | (same as Mac?) | Not yet stored |

---

## Status

| Item | Status |
|------|--------|
| GitHub repo | ✅ Created (ajayvm1984/argus) |
| Oracle Cloud VM | ⏳ Needs credentials |
| Docker Hub | ✅ Account created |
| Twilio | ⏳ Not signed up |
| Keygen.sh | ⏳ Not signed up |
| Argus build | 🚫 Not started |

---

## Support Philosophy

When customers have issues:
1. Customer runs `/api/diagnostics` → shares JSON
2. Or runs `argus support-bundle` → sends zip
3. Or forwards Telegram alert to Ajay
4. I diagnose from the output

Most issues are **configuration**, not code:
- Switches not sending NetFlow
- Firewall blocking UDP 2055/6343
- Wrong SNMP community string
- Zabbix discovery not run

---

*This file is the source of truth for all Argus project knowledge. Update after each session.*
