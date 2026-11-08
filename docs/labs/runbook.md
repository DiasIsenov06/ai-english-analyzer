# AI English Analyzer — іске қосу, тексеру, қалпына келтіру

Prerequisites: Node 24, npm, Python 3.12, Docker Desktop running. Repo root-та орындаңыз. Windows-та `npm.cmd`/`npx.cmd` қолданыңыз. Құпия мәндерді log/chat/repo-ға шығармаңыз.

## Жергілікті сайт
1. `npm ci`; `.env.example` файлын `.env` етіп көшіру (бар `.env` үстінен жазбаңыз).
2. DATABASE_URL-ды өз development DB-ге қойыңыз. JWT_SECRET үшін криптографиялық кездейсоқ≥32 байт жасаңыз, defaultplaceholder жарамайды. `AI_ENABLED=false` қазір пайдаланушы таңдауы.
3. Тек жаңа development DB үшін `npx prisma db push`; бар remoteproduction DB-ге осы команданы орындамаңыз.
4. `npm run dev`, браузерде http://127.0.0.1:3000. `npm run build && npm start` — production build-тің local іске қосылуы.

## Қауіпсіз automated test
```powershell
docker compose -f docker-compose.test.yml up -d --wait
npm.cmd ci
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:coverage
npx.cmd playwright install chromium
npm.cmd run test:e2e
python -m pip install -r scripts/labs/requirements-test.txt
python -m pytest -q tests/lab10 --cov=scripts.dora --cov-fail-under=55
python scripts/labs/verify_portfolio.py
npm.cmd run build
```
Playwright runner өз subprocess-інде DATABASE_URL=localhost:55432/aea_lab_test, AIoff және бөлек .next-test орнатады. .env remote мәнінен басым; тек test DB-ге schema push жасайды. Оның ephemeral data-сы контейнер тоқтаса жоғалады (tmpfs). App 3100-ді автоматты бастайды/тоқтатады, main 3000-ге тимейді.

## Docker app
`docker compose up -d --wait db` → `docker compose build app` → тек жаңа LOCAL compose DB үшін `docker compose run --rm app npx prisma db push` → `docker compose up -d app`. Dockerfile startup schema өзгертпейді, non-root user. Қазіргі compose credentials оқу/local үшін; public deployment алдында бөлек secret/network configuration қажет. Бүкіл monitoring stack-ты қажетсіз қоспаңыз.

## Backup/restore rehearsal (тек test compose)
```powershell
docker compose -f docker-compose.test.yml exec -T db sh -c 'pg_dump -U lab_test -d aea_lab_test -Fc > /tmp/aea-backup.dump'
docker compose -f docker-compose.test.yml exec -T db createdb -U lab_test aea_restore_check
docker compose -f docker-compose.test.yml exec -T db pg_restore -U lab_test -d aea_restore_check /tmp/aea-backup.dump
docker compose -f docker-compose.test.yml exec -T db psql -U lab_test -d aea_restore_check -c 'SELECT count(*) FROM "User"'
```
Target DB аты жаңа болуы тиіс; бар DB-ні drop/overwrite етпеңіз. Source/target барлық негізгі table count және plan/task байланысын салыстырыңыз. 08.11 rehearsal: source 5 user, restored 5 user, команда 2.24 сек; бұл үлкен production DB үшін RTO кепілі емес. DB ішіндегі уақытша backup контейнермен бірге жойылады; бұл өндірістік backup retention емес.

## Ақау кезінде
401: қайта кіру, JWT config тексеру (мәнін басып шығармау). DBhealth 503: container/connection және шектеулі log. AI 400/429: AI_ENABLED=false, жалпы подсказка, кілтті тек secretstore-да жаңарту. Plan 404: осы пайдаланушыда жоспар бар ма, day 1..28 ме; бөтен owner filter-ін алып тастамау. Builderror: Node 24/lockfile/Prismagenerate. Security gate: finding бойынша issue, сканерді өшірмеңіз.

Rollback: releaseSHA/image digest сақтаңыз; previous image deploy, smoke. Schema additive болса backward compatible code; destructive change болса жаңа isolated restoreDB және reconcile decision, sourcebackup үстінен соқыр overwrite жоқ. Reviewer Диас/Расуул, scope decision Есқат. Нақты cloud deployment осы тапсырмада жасалмады.

Тәуелсіз rehearsal формасы: орындаушы __; күн __; commit __; start/end __; commands/result __; қиындық __; PASS/FAIL __. Адам толтырады, дайын қолтаңба жоқ.
