#!/bin/bash
# SSL сертификатын баптау скрипті
# Self-signed (локалды тест үшін) немесе Let's Encrypt (продакшн үшін)

SSL_DIR="./nginx/ssl"
mkdir -p "$SSL_DIR"

if [ "$1" = "prod" ]; then
    # --- Продакшн: Let's Encrypt (certbot) ---
    DOMAIN="${2:-yourdomain.com}"
    EMAIL="${3:-admin@yourdomain.com}"
    echo "Let's Encrypt сертификатын алу: $DOMAIN"
    docker run --rm \
        -v "$(pwd)/nginx/ssl:/etc/letsencrypt/live/$DOMAIN" \
        -v "$(pwd)/nginx/certbot:/var/www/certbot" \
        certbot/certbot certonly \
        --webroot --webroot-path /var/www/certbot \
        --email "$EMAIL" --agree-tos --no-eff-email \
        -d "$DOMAIN"
    echo "Сертификат алынды: $SSL_DIR/"
else
    # --- Локалды: Self-signed сертификат ---
    echo "Self-signed SSL сертификатын жасау..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$SSL_DIR/key.pem" \
        -out "$SSL_DIR/cert.pem" \
        -subj "/C=KZ/ST=Astana/L=Astana/O=AI English Analyzer/OU=Dev/CN=localhost"
    echo "Self-signed сертификат жасалды: $SSL_DIR/"
    echo "  Сертификат: $SSL_DIR/cert.pem"
    echo "  Кілт:       $SSL_DIR/key.pem"
fi
