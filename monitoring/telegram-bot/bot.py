"""
Telegram Bot Alert — Alertmanager webhook қабылдаушы
Alertmanager ескертулерін Telegram чатқа жібереді.

Орнату:
  pip install flask requests
  TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=yyy python bot.py
"""

import os
import json
import requests
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
        print("ЕСКЕРТУ: TELEGRAM_BOT_TOKEN немесе TELEGRAM_CHAT_ID орнатылмаған")
        return False
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        return resp.status_code == 200
    except Exception as e:
        print(f"Telegram жіберу қатесі: {e}")
        return False


@app.route("/alert", methods=["POST"])
def alert():
    data = request.get_json(force=True) or {}
    alerts = data.get("alerts", [])

    for alert_item in alerts:
        status    = alert_item.get("status", "firing")
        labels    = alert_item.get("labels", {})
        ann       = alert_item.get("annotations", {})
        severity  = labels.get("severity", "info")
        name      = labels.get("alertname", "Белгісіз")
        emoji     = SEVERITY_EMOJI.get(severity, "⚪")

        if status == "resolved":
            icon = "✅"
            header = f"{icon} <b>ШЕШІЛДІ</b>"
        else:
            icon = emoji
            header = f"{icon} <b>ЕСКЕРТУ [{severity.upper()}]</b>"

        summary     = ann.get("summary", name)
        description = ann.get("description", "")

        msg = (
            f"{header}\n"
            f"📌 <b>{summary}</b>\n"
            f"{description}\n\n"
            f"🏷 Сервис: <code>{labels.get('service', 'n/a')}</code>\n"
            f"🖥 Инстанс: <code>{labels.get('instance', 'n/a')}</code>"
        )
        send_telegram(msg)

    return jsonify({"status": "ok"}), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Telegram Alert Bot іске қосылуда (порт: {port})")
    app.run(host="0.0.0.0", port=port)
