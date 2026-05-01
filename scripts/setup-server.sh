#!/bin/bash
# Сервер баптау скрипті
# UFW Firewall + Fail2Ban + пайдаланушы баптау
# Қолданылуы: sudo bash scripts/setup-server.sh [username]

set -e

APP_USER="${1:-appuser}"
echo "========================================="
echo " AI English Analyzer — Сервер баптау"
echo "========================================="

# --- 1. Жүйені жаңарту ---
echo "[1/6] Жүйені жаңарту..."
apt-get update -y && apt-get upgrade -y

# --- 2. Пайдаланушы жасау ---
echo "[2/6] '$APP_USER' пайдаланушысын жасау..."
if id "$APP_USER" &>/dev/null; then
    echo "  Пайдаланушы '$APP_USER' бұрыннан бар, өткізіп жіберу"
else
    adduser --disabled-password --gecos "" "$APP_USER"
    usermod -aG sudo "$APP_USER"
    usermod -aG docker "$APP_USER" 2>/dev/null || true
    echo "  '$APP_USER' пайдаланушысы жасалды және sudo тобына қосылды"
fi

# SSH кілттер каталогын жасау
mkdir -p /home/"$APP_USER"/.ssh
chmod 700 /home/"$APP_USER"/.ssh
chown -R "$APP_USER":"$APP_USER" /home/"$APP_USER"/.ssh

# --- 3. SSH баптау (қауіпсіздік) ---
echo "[3/6] SSH баптау..."
SSHD_CONFIG="/etc/ssh/sshd_config"
cp "$SSHD_CONFIG" "${SSHD_CONFIG}.backup"

# Root логинді өшіру, тек кілтпен кіру
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' "$SSHD_CONFIG"
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' "$SSHD_CONFIG"
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' "$SSHD_CONFIG"
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' "$SSHD_CONFIG"

systemctl restart sshd
echo "  SSH: root логин өшірілді, тек SSH кілтімен кіру рұқсатталды"

# --- 4. UFW Firewall баптау ---
echo "[4/6] UFW Firewall баптау..."
apt-get install -y ufw

ufw default deny incoming
ufw default allow outgoing

ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Next.js (dev)
ufw allow 9090/tcp  # Prometheus
ufw allow 3001/tcp  # Grafana

ufw --force enable
echo "  UFW іске қосылды:"
ufw status verbose

# --- 5. Fail2Ban баптау ---
echo "[5/6] Fail2Ban орнату және баптау..."
apt-get install -y fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5
backend  = systemd

[sshd]
enabled  = true
port     = ssh
logpath  = %(sshd_log)s
maxretry = 3
bantime  = 7200

[nginx-http-auth]
enabled  = true
port     = http,https
logpath  = /var/log/nginx/error.log
maxretry = 5

[nginx-limit-req]
enabled  = true
port     = http,https
logpath  = /var/log/nginx/error.log
maxretry = 10
findtime = 60
bantime  = 300
EOF

systemctl enable fail2ban
systemctl restart fail2ban
echo "  Fail2Ban іске қосылды"
fail2ban-client status

# --- 6. Docker орнату (егер жоқ болса) ---
echo "[6/6] Docker тексеру..."
if ! command -v docker &>/dev/null; then
    echo "  Docker орнатылуда..."
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker
    systemctl start docker
    usermod -aG docker "$APP_USER"
    echo "  Docker орнатылды"
else
    echo "  Docker бұрыннан орнатылған: $(docker --version)"
fi

echo ""
echo "========================================="
echo " Баптау аяқталды!"
echo "========================================="
echo " SSH пайдаланушы: $APP_USER"
echo " Firewall (UFW):  іске қосылды"
echo " Fail2Ban:        іске қосылды"
echo " Docker:          іске қосылды"
echo ""
echo " Келесі қадам: SSH public кілтін қосу"
echo "   cat ~/.ssh/id_rsa.pub >> /home/$APP_USER/.ssh/authorized_keys"
echo "=========================================="
