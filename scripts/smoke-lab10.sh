#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${1:-http://127.0.0.1:3000}"
for attempt in $(seq 1 40); do
  if body="$(curl --connect-timeout 3 --max-time 8 -fsS "${BASE_URL}/api/health" 2>/dev/null)"; then
    if printf '%s' "$body" | grep -q '"database":"ok"'; then
      curl --connect-timeout 3 --max-time 8 -fsS "${BASE_URL}/" >/dev/null
      echo "Smoke passed: /api/health (DB) and / (HTTP 2xx), attempt ${attempt}"
      exit 0
    fi
  fi
  sleep 5
done
echo "Smoke failed: application/database readiness never became healthy" >&2
exit 1
