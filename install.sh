#!/bin/bash
# Argus Installation Script
# One-command install for Ubuntu 22.04 LTS

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              Argus Network Monitor v1.0                     ║"
echo "║              Meridian Cyber                                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root: sudo ./install.sh"
    exit 1
fi

# Detect OS
if [ ! -f /etc/os-release ]; then
    echo "Error: This script requires Ubuntu 22.04 LTS"
    exit 1
fi

. /etc/os-release
if [ "$ID" != "ubuntu" ] || [ "$VERSION_ID" != "22.04" ]; then
    echo "Error: This script requires Ubuntu 22.04 LTS (current: $ID $VERSION_ID)"
    exit 1
fi

echo "[1/7] Updating system..."
apt-get update -qq
apt-get upgrade -y -qq

echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

echo "[3/7] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -fsSL "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "[4/7] Creating Argus user..."
useradd -m -s /bin/bash argus || true
usermod -aG docker argus

echo "[5/7] Creating installation directory..."
mkdir -p /opt/argus
cp -r . /opt/argus/
cd /opt/argus

echo "[6/7] Setting permissions..."
chown -R argus:argus /opt/argus
chmod +x install.sh

echo "[7/7] Starting Argus..."
sudo -u argus bash -c 'cp .env.example .env && nano .env'
sudo -u argus bash -c 'docker-compose up -d'

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Installation complete!                                     ║"
echo "║  Run 'sudo systemctl enable argus' to start on boot        ║"
echo "║  Access: https://your-server-ip                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
