"""
Telegram Alert Bot — AI English Analyzer мониторингі
Alertmanager webhook-тарын қабылдап Telegram чатқа жібереді.

Орнату:
  docker-compose up -d telegram-alert-bot

Тест жіберу:
  curl -X POST http://localhost:8090/test
"""

import os
import json
import requests
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
CHAT_ID   = os.environ.get("TELEGRAM_CHAT_ID", "")

SEVERITY_EMOJI = {
    "critical": "🔴",
    "warning":  "🟡",
    "info":     "🔵",
}


def send_telegram(message: str) -> bool:
    if not BOT_TOKEN or not CHAT_ID:
        print("⚠️  TELEGRAM_BOT_TOKEN немесе TELEGRAM_CHAT_ID орнатылмаған")
        return False

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        if resp.status_code != 200:
            print(f"Telegram қатесі: {resp.status_code} — {resp.text}")
            return False
        return True
    except Exception as e:
        print(f"Telegram жіберу қатесі: {e}")
        return False


def format_alert(alert_item: dict) -> str:
    status    = alert_item.get("status", "firing")
    labels    = alert_item.get("labels", {})
    ann       = alert_item.get("annotations", {})
    severity  = labels.get("severity", "info")
    name      = labels.get("alertname", "Белгісіз")
    emoji     = SEVERITY_EMOJI.get(severity, "⚪")

    now = datetime.utcnow().strftime("%H:%M UTC")

    if status == "resolved":
        header = f"✅ <b>ШЕШІЛДІ</b> — {name}"
    else:
        header = f"{emoji} <b>ЕСКЕРТУ [{severity.upper()}]</b>"

    summary     = ann.get("summary", name)
    description = ann.get("description", "")
    instance    = labels.get("instance", "n/a")
    service     = labels.get("service", "ai-english-analyzer")

    lines = [
        header,
        f"",
        f"📌 <b>{summary}</b>",
    ]

    if description:
        lines.append(f"📝 {description}")

    lines += [
        f"",
        f"🖥 Инстанс: <code>{instance}</code>",
        f"🏷 Сервис: <code>{service}</code>",
        f"🕐 Уақыт: {now}",
    ]

    return "\n".join(lines)


# ── Alertmanager webhook ──────────────────────────────────────
@app.route("/alert", methods=["POST"])
def alert():
    data   = request.get_json(force=True) or {}
    alerts = data.get("alerts", [])
    sent   = 0

    for alert_item in alerts:
        msg = format_alert(alert_item)
        if send_telegram(msg):
            sent += 1

    return jsonify({"status": "ok", "sent": sent, "total": len(alerts)}), 200


# ── Тест хабарлама ────────────────────────────────────────────
@app.route("/test", methods=["POST", "GET"])
def test():
    msg = (
        "🧪 <b>AI English Analyzer — Тест хабарлама</b>\n\n"
        "✅ Telegram бот дұрыс жұмыс жасауда!\n"
        "📊 Мониторинг: Prometheus + Alertmanager → Bot → Telegram\n\n"
        f"🕐 {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"
    )
    ok = send_telegram(msg)
    if ok:
        return jsonify({"status": "ok", "message": "Тест хабарлама жіберілді"}), 200
    else:
        return jsonify({"status": "error", "message": "Токен немесе Chat ID дұрыс емес"}), 500


# ── Health check ──────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    configured = bool(BOT_TOKEN and CHAT_ID)
    return jsonify({
        "status": "ok",
        "configured": configured,
        "bot_token_set": bool(BOT_TOKEN),
        "chat_id_set": bool(CHAT_ID),
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"🤖 Telegram Alert Bot іске қосылуда (порт: {port})")
    print(f"   Token: {'✅ орнатылған' if BOT_TOKEN else '❌ орнатылмаған'}")
    print(f"   Chat ID: {'✅ орнатылған' if CHAT_ID else '❌ орнатылмаған'}")
    app.run(host="0.0.0.0", port=port)
