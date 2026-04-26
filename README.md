# Argus — Network Monitoring Platform

**Status:** 🚧 Under Development

---

## What is Argus?

Argus is a **complete network monitoring platform** for MSPs (Managed Service Providers). Built as a single VM solution that customers install on their own infrastructure.

### Features

- 🔍 **SNMP Monitoring** via Zabbix — polls routers, switches, servers, firewalls
- 📊 **NetFlow Analysis** via ntopng — top talkers, active flows, traffic analysis  
- 🔔 **Smart Alerts** — WhatsApp → SMS → Email via Twilio
- 🛡️ **Multi-Tenant** — manage multiple customer networks from one dashboard
- 🔐 **License Control** — Keygen.sh validation, 30-day offline grace
- 🌐 **Browser Install Wizard** — /setup guides configuration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| VM | Ubuntu 22.04 LTS |
| Containers | Docker Compose |
| UI | React 18 + TypeScript + Vite + Tailwind |
| API | Node.js + Express |
| Auth | Keycloak 22.x |
| Database | PostgreSQL 16 + TimescaleDB |
| Monitoring | Zabbix Server 7.2 LTS |
| Flow Analytics | ntopng 6.x |
| Alert Dispatcher | Node.js worker + Twilio |
| License | Python daemon + Keygen.sh |
| Reverse Proxy | Nginx 1.25 |

---

## Architecture

```
                    +---------------------+
              443 --| Nginx (TLS)          |
                    +----------+----------+
                               |
                  +------------+------------+
                  |                          |
                  v                          v
            +-----------+          +--------------------+
            | Argus UI  |          | Argus API Gateway  |
            | (static)  |          | (Node.js :8080)   |
            +-----------+          +----------+---------+
                                                |
                  +-----------------------------+-------------+
                  |                  |                        |
                  v                  v                        v
            +-----------+     +------------+          +--------------+
            | Keycloak  |     | Zabbix API |          | ntopng       |
            | :8180     |     | :80        |          | :3000        |
            +-----+------+     +------+-----+          +--------------+
                  |                  |
                  v                  v
            +-----------+     +-------------------+
            | Postgres  |     | Postgres          |
            | (keycloak)|     | (zabbix + argus)  |
            +-----------+     +-------------------+
```

---

## Repository Structure

```
argus/
├── docker-compose.yml       # Production compose
├── docker-compose.dev.yml   # Dev overrides
├── ui/                     # React frontend
├── api/                    # Node.js API gateway
├── alert-dispatcher/        # Twilio worker
├── license-daemon/          # Keygen.sh daemon
├── infra/                  # Nginx, Keycloak, Zabbix configs
└── docs/                   # Documentation
```

---

## Development Status

| Module | Status |
|--------|--------|
| 0. Setup | 🔄 In Progress |
| 1. Docker Scaffold | ⬜ Not Started |
| 2. Database Schema | ⬜ Not Started |
| 3. API Gateway | ⬜ Not Started |
| 4. Zabbix Integration | ⬜ Not Started |
| 5. ntopng Integration | ⬜ Not Started |
| 6. License Daemon | ⬜ Not Started |
| 7. Alert Dispatcher | ⬜ Not Started |
| 8. React UI | ⬜ Not Started |
| 9. Install Wizard | ⬜ Not Started |

---

## Owner

**Meridian Cyber** — Ajay Mathai
- Email: ajay@meridiancyber.ai
- Web: https://meridiancyber.ai

---

## License

Proprietary — All rights reserved Meridian Cyber.
