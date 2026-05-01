#!/bin/bash
# Автоматты орналастыру (deploy) скрипті
# Қолданылуы: bash scripts/deploy.sh [prod|dev]

set -e

MODE="${1:-dev}"
echo "============================================"
echo " AI English Analyzer — Deploy ($MODE)"
echo "============================================"

# --- 1. Тарту (git pull) ---
echo "[1/5] Git pull..."
git pull origin main

# --- 2. SSL сертификат (тек prod) ---
if [ "$MODE" = "prod" ]; then
    echo "[2/5] SSL сертификатын тексеру..."
    if [ ! -f "./nginx/ssl/cert.pem" ]; then
        echo "  Self-signed SSL жасалуда..."
        bash scripts/../nginx/ssl-setup.sh
    else
        echo "  SSL сертификат бар"
    fi
else
    echo "[2/5] Dev режимі — SSL өткізілді"
fi

# --- 3. Сақтық көшірме ---
echo "[3/5] Дерекқор сақтық көшірмесі..."
if docker ps | grep -q ai-english-db; then
    bash scripts/backup.sh backup || echo "  Сақтық көшірме жасалмады (контейнер жоқ)"
else
    echo "  DB контейнері жоқ — сақтық көшірме өткізілді"
fi

# --- 4. Docker Compose іске қосу ---
echo "[4/5] Docker Compose іске қосу..."
if [ "$MODE" = "prod" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d --build
else
    docker-compose up -d --build
fi

# --- 5. Денсаулық тексеру ---
echo "[5/5] Денсаулық тексеру..."
sleep 10
if curl -sf http://localhost:3000 > /dev/null; then
    echo "  Қосымша жұмыс істеп тұр: http://localhost:3000"
else
    echo "  ЕСКЕРТУ: Қосымшаға қатынасу мүмкін болмады"
    docker-compose logs app --tail=20
fi

echo ""
echo "============================================"
echo " Deploy аяқталды!"
if [ "$MODE" = "prod" ]; then
    echo " Қосымша:   https://yourdomain.com"
    echo " Grafana:    https://yourdomain.com/grafana"
    echo " Prometheus: http://yourdomain.com:9090"
else
    echo " Қосымша:   http://localhost:3000"
    echo " Grafana:    http://localhost:3001"
    echo " Prometheus: http://localhost:9090"
fi
echo "============================================"
