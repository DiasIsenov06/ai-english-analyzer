#!/bin/bash
# Дерекқор сақтық көшірмесін жасау скрипті (Backup / Dump)
# Қолданылуы: bash scripts/backup.sh [restore <file>]

set -e

BACKUP_DIR="./backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql.gz"

DB_CONTAINER="ai-english-db"
DB_USER="ai_user"
DB_NAME="ai_english_analyzer"

mkdir -p "$BACKUP_DIR"

# =====================================
# BACKUP (сақтық көшірме жасау)
# =====================================
backup() {
    echo "Дерекқор сақтық көшірмесін жасау: $DB_NAME"
    echo "Файл: $BACKUP_FILE"

    docker exec "$DB_CONTAINER" \
        pg_dump -U "$DB_USER" "$DB_NAME" \
        | gzip > "$BACKUP_FILE"

    SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
    echo "Сақтық көшірме жасалды: $BACKUP_FILE ($SIZE)"

    # 7 күннен ескі файлдарды жою
    find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +7 -delete
    echo "7 күннен ескі сақтық көшірмелер жойылды"

    # Барлық сақтық көшірмелер тізімі
    echo ""
    echo "Бар сақтық көшірмелер:"
    ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "  (жоқ)"
}

# =====================================
# RESTORE (қалпына келтіру)
# =====================================
restore() {
    RESTORE_FILE="$1"
    if [ -z "$RESTORE_FILE" ]; then
        echo "Қате: қалпына келтіру файлын көрсетіңіз"
        echo "  Қолданылуы: bash scripts/backup.sh restore backups/db_backup_YYYY-MM-DD_HH-MM-SS.sql.gz"
        exit 1
    fi

    if [ ! -f "$RESTORE_FILE" ]; then
        echo "Қате: файл табылмады: $RESTORE_FILE"
        exit 1
    fi

    echo "НАЗАР: $DB_NAME дерекқоры $RESTORE_FILE файлымен қайта жүктеледі!"
    echo "Жалғастырасыз ба? (yes/no)"
    read -r CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        echo "Тоқтатылды"
        exit 0
    fi

    echo "Қалпына келтірілуде: $RESTORE_FILE → $DB_NAME"

    gunzip -c "$RESTORE_FILE" | docker exec -i "$DB_CONTAINER" \
        psql -U "$DB_USER" -d "$DB_NAME"

    echo "Дерекқор қалпына келтірілді!"
}

# =====================================
# НЕГІЗГІ ЛОГИКА
# =====================================
case "${1:-backup}" in
    restore)
        restore "$2"
        ;;
    backup|*)
        backup
        ;;
esac
