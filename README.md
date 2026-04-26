# Argus — Network Monitoring Platform

**Status:** 🚧 Under Active Development

---

## What is Argus?

Argus is a complete network monitoring platform for MSPs (Managed Service Providers). Drop into a single Ubuntu 22.04 VM, monitors customer networks via SNMP and NetFlow, sends smart alerts via WhatsApp/SMS/Email.

**Target customers:** Hotels, restaurants, offices, hospitals — any organization that needs network monitoring but lacks IT staff.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| VM | Ubuntu 22.04 LTS |
| Containers | Docker Compose |
| UI | React 18 + TypeScript + Vite + Tailwind CSS |
| API | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 + TimescaleDB |
| Auth | Keycloak 22.x |
| Monitoring | Zabbix Server 7.2 LTS |
| Flow Analytics | ntopng 6.x |
| Alerts | Node.js worker + Twilio |
| License | Keygen.sh |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/ajayvm1984/argus.git
cd argus

# 2. Copy environment
cp .env.example .env
# Edit .env with your credentials

# 3. Install (Ubuntu 22.04)
chmod +x install.sh
sudo ./install.sh

# 4. Access
# https://your-server-ip   (HTTPS, self-signed cert initially)
```

---

## Repository Structure

```
argus/
├── docker-compose.yml       # Full production stack
├── .env.example            # Environment template
├── install.sh              # One-command Ubuntu installer
├── LICENSE                 # Proprietary license
├── ui/                     # React frontend
│   ├── Dockerfile
│   └── src/
├── api/                    # Node.js API gateway
│   ├── Dockerfile
│   └── src/
│       ├── routes/         # REST endpoints
│       ├── middleware/      # Auth, error handling
│       ├── models/         # Drizzle ORM schemas
│       └── services/        # Zabbix, ntopng clients
├── alert-dispatcher/        # Twilio alert worker
│   ├── Dockerfile
│   └── src/
├── license-daemon/          # Keygen.sh Python daemon
│   └── argus_license/
├── infra/                  # Infrastructure configs
│   ├── nginx/
│   ├── keycloak/
│   ├── zabbix/
│   └── postgres/
└── docs/                   # Documentation
```

---

## Development Status

| Module | Status | Notes |
|--------|--------|-------|
| 0. Setup & Scaffold | 🔄 In Progress | Docker Compose scaffold complete |
| 1. Database Schema | 🔄 In Progress | Drizzle ORM schemas defined |
| 2. API Gateway | 🔄 In Progress | Core routes implemented |
| 3. Zabbix Integration | ⬜ Not Started | |
| 4. ntopng Integration | ⬜ Not Started | |
| 5. License Daemon | ⬜ Not Started | |
| 6. Alert Dispatcher | ⬜ Not Started | |
| 7. React UI | ⬜ Not Started | |
| 8. Install Wizard | ⬜ Not Started | |

---

## Architecture

```
                         Cloudflare/CDN
                               |
                    +----------+----------+
                    |    Nginx (TLS)      |
                    +----------+----------+
                               |
              +----------------+------------+
              |                             |
              v                             v
        +-----------+             +----------------+
        |  Argus UI |             |  Argus API      |
        |  (React)  |             |  (Node.js :8080)|
        +-----------+             +--------+---------+
                                                  |
                         +-------------------------+--------------------+
                         |                         |                    |
                         v                         v                    v
                   +----------+            +-----------+         +--------+
                   | Keycloak |            |  Zabbix   |         | ntopng |
                   |  :8180   |            |   :80     |         | :3000  |
                   +----+------+            +-----+-----+         +----+---+
                        |                        |                    |
                        v                        v                    v
                   +-----------------------------------------+
                   |         PostgreSQL + TimescaleDB         |
                   |            (argus-db :5432)              |
                   +-----------------------------------------+
```

---

## Owner

**Meridian Cyber**
- Website: https://meridiancyber.ai
- Email: ajay@meridiancyber.ai

---

## License

Proprietary — All rights reserved Meridian Cyber. See LICENSE file.
