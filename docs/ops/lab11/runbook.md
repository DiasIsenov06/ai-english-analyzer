# ЛЗ11 Runbook — AI English Analyzer /api/health 503 немесе сайт ашылмайды

**Кімге:** жобаны бұрын жазбаған кезекші. **Шектеу:** бұл құжат оқу/staging үшін, production базасын drop/restore жасамайды.
Алдын ала керек: Docker Desktop, Git clone, Node 24, npm; Docker Compose test мен GitHub run URL. Ешқашан \`.env\` мәнін логқа жіберме.

## Белгі
- \`curl -i http://127.0.0.1:3000/api/health\` → HTTP 503, \`"database":"unavailable"\` не timeout.
- UAT және rollout тоқтатылады, security ownership guard өшірілмейді.

## Диагностика
1. Репо түбіріне өтіп, \`docker compose -f docker-compose.test.yml ps\`. Test DB service \`healthy\` болуы тиіс.
2. \`docker compose -f docker-compose.test.yml logs --tail=40 db\` — пароль/дерек экспортталмауын тексер.
3. \`docker compose -f docker-compose.test.yml exec -T db pg_isready -U lab_test -d aea_lab_test\`.
4. Тек тест ортада \`curl -i http://127.0.0.1:3100/api/health\` (Playwright іске қосқан local app); \`200/database ok\` — readiness өтті.
5. Егер \`Connection refused\`: DB container stopped, port 55432 бос емес не \`DATABASE_URL\` test URL емес. \`docker compose -f docker-compose.test.yml ps\` арқылы тексер.

## Қалпына келтіру — test/staging
6. \`docker compose -f docker-compose.test.yml up -d --wait db\` — test DB қайта іске қосылады.
7. \`npm ci\`, \`npx playwright install chromium\` (бір рет); \`npm run test:e2e\`. Playwright өзі 3100-де оқшауланған app бастайды және 3 тестті жүргізеді.
8. \`npm run test:coverage\` және \`npm run typecheck\` → кодқа әсері жоқтығын тексер.
9. CI қайта іске қосылғанда \`quality/security/image/deploy-staging\` job сілтемелерін сақта. Бірақ \`main\` deployment үшін PR review және security gate қажет.

## Егер дерек шынымен жоғалса
- Test DB ғана болса \`docs/labs/runbook.md\` ішіндегі isolated restore rehearsal. Жаңа базаға restore, **original DB-ні overwrite етпеңіз**.
- Production outage болса жоба иесіне және инфрақұрылым жауаптысына хабарла. Жарамды backup/restore plan болмаса өз бетіңше schema push/DB drop жасама.
- App ескі image digest-іне rollback — тек бекітілген deployment тәртібімен, миграцияға сай келгенде.

## Қашан эскалация
- 5 мин ішінде diagnose болмаса және негізгі сценарий істемесе, owner **Ақжан Расуулға** GitHub Issue/comment және арнамен хабарлау.
- 15 мин ішінде қайталап қалпына келмесе release-blocker ашу, production deployment жасамау.
- Incident time detected/ack/restore, әсер еткен нақты операциялар, қадамдары — \`docs/qa/lab11/incident-log.csv\` файлында адам толтырады.
- UAT туралы сыртқы адам қажет: \`docs/qa/lab11/independent-check.md\` формасын орындаушы өзі толтырып, қол қойсын. Автор бұл сынақты жалған "passed" деп жаза алмайды.
