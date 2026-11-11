# ЛЗ11 — дерек генераторы мен k6 сынағы

## Қауіпсіз синтетикалық дерек
\`\`\`powershell
python scripts/labs/seed_lab11.py --out data/lab11 --users 50 --activities 500
python -m unittest discover -s tests/lab11 -p "test_*.py" -v
\`\`\`
Нәтиже: \`synthetic_users.csv\`, \`synthetic_activities.csv\`, \`manifest.json\`. Тек файл, DB-ге жазбайды. Seed=42, e-mail \`example.invalid\`. Жергілікті генератор тексерілсе де тәуелсіз UAT өткізіліп кетті деген сөз емес.

## k6: қауіпті ортаға автоматты жібермеу
\`\`\`powershell
$env:K6_BASE_URL="http://127.0.0.1:3100"
$env:K6_EMAIL="student0001@example.invalid"
$env:K6_PASSWORD="синтетикалық тест тіркелгісінің паролі"
$env:K6_BEARER_TOKEN="тек тест тіркелгісіне берілген JWT"
k6 run tests/load/lab11.js
\`\`\`
**Бұл команданы іске қосар алдында** пайдаланушыны test DB-ге тіркеп, оның 28 күндік жоспарын құрыңыз. Жалғыз \`seed_lab11.py\` CSV генераторы test DB-ге тіркелгі жасамайды. Playwright-тың оқшауланған тест контейнерін және app-ты қосыңыз.

- N01 login: p95 ≤2000ms, 100 synthetic сұрау.
- N02 current-plan GET: p95 ≤10000ms, 100 сұрау. Full generation уақыты емес.
- N03 readiness proxy: >=99.5% 60 probe; бұл production SLO емес.

Нақты k6 орындалуы, VU/latency нәтижесі бұл құжат әзірленген күні расталмады. Расталмаған сан енгізілмейді.

## Жинақталған деректер
- [Тест жоспары](test-plan.md)
- [UAT және қол қоюға бос хаттама](uat-cases-and-protocol.md)
- [Нақты GitHub CI incident postmortem](postmortem-ci.md)
- [Runbook](../../ops/lab11/runbook.md)
- [Тәуелсіз runbook form](independent-check.md)
