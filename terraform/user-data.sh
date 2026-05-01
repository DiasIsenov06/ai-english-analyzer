#!/bin/bash
# EC2 инстанс бастапқы баптауы (Terraform user_data)
# Сервер іске қосылғанда автоматты орындалады

set -e
exec > /var/log/user-data.log 2>&1

echo "=== AI English Analyzer — Сервер автоматты баптауы ==="

# --- Жүйені жаңарту ---
apt-get update -y && apt-get upgrade -y

# --- Docker орнату ---
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker

# --- Docker Compose орнату ---
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# --- Git орнату ---
apt-get install -y git ufw fail2ban

# --- UFW Firewall ---
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3001/tcp
ufw allow 8080/tcp
ufw --force enable

# --- Fail2Ban ---
systemctl enable fail2ban
systemctl start fail2ban

# --- Проектті тарту ---
mkdir -p /opt/ai-english-analyzer
cd /opt/ai-english-analyzer
git clone https://github.com/DiasIsenov06/ai-english-analyzer.git .

# --- .env файлын жасау ---
cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://${db_username}:${db_password}@db:5432/${db_name}
JWT_SECRET=${jwt_secret}
GEMINI_API_KEY=${gemini_api_key}
GRAFANA_PASSWORD=admin123
ENVEOF

# --- SSL сертификат жасау ---
bash nginx/ssl-setup.sh

# --- Docker Compose іске қосу ---
docker-compose up -d --build

echo "=== Баптау аяқталды ==="
echo "Қосымша: http://$(curl -s ifconfig.me):3000"
echo "Grafana:  http://$(curl -s ifconfig.me):3001"
