# ЛЗ11: AI English Analyzer — тестілеу және қабылдау жоспары

**Тексеру базасы:** main commit 88100dac1f87883940a6b4d2bde04865acf2015e (08.11.2026). 11.11.2026 талдау. Бұл жоспар — бұрынғы docs/labs/lab-11.md материалын кеңейту; нақты UAT өткізу туралы жалған мәлімдеме жасалмайды.

## Мақсат және тәсіл
28 күндік жеке жоспар, тіркелу/кіру, тест нәтижесінің тарихы, оқу прогресі, бөтен пайдаланушы дерегін оқымау/өзгертпеу, AI өшіру кезіндегі fallback және резервтен қалпына келтіруді тексеру. Код базасы: Next.js 15, React 19, TypeScript, Prisma, PostgreSQL 16.

| Деңгей | Жоспардағы үлес | Құрал және қайда | Нені тексереді |
|---|---:|---|---|
| Unit / route | ~65% | Vitest, әр PR | JWT қолтаңбасы, validation, 28 күн, owner guard, теріс сценарийлер |
| Integration | ~25% | Playwright API + оқшауланған PostgreSQL, CI | Register/login, тарих, 28 күн/84 task, atomic progress, AI fallback |
| Browser E2E | ~10% | Playwright Chromium, CI/PR | Тіркелу, navigation, 390px, privacy toggle |
| Load | бөлек 3 сынақ | k6 тек арнайы стендте | N01 login p95 ≤2с; N02 plan p95 ≤10с; N03 health 99.5% (қосымша proxy ретінде ғана) |
| Human UAT | 10 сценарий | басқа команда/тапсырыс беруші | Қолданушы күткен нәтиже мен ыңғайлылық |
| Manual & recovery | release алдында | runbook + restore rehearsal | Keyboard, локализация, backup/restore, monitoring |

**Шектеу:** unit және API тест саны — бүкіл UI coverage%-ын білдірмейді. 08.11 бойынша docs/labs/evidence/verification.json: 27 unit/route, 3 E2E және 10 DORA тест, таңдалған auth/validation файлдарында line=100%, branch=97.36%; Playwright unexpected=0. 08.11 green GitHub Actions: https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/42442525642 . Уақытша staging ≠ production.

## Сынақ деректері
Тек жалған \`student0001@example.invalid\` сияқты e-mail, тіркелген seed=42, нақты аты-жөн/ЖСН/телефон/клиент сұранысы жоқ. Test DB: \`aea_lab_test\`, 127.0.0.1:55432, tmpfs; development/production базасы пайдаланылмайды. \`scripts/labs/seed_lab11.py\` тұрақты 50 пайдаланушы мен 500 жаттығу жазбасын **файлға** ғана жасайды; DB-ге import-ты өздігінен жасамайды. Сыртқы LLM тестте өшірулі.

## Орталар
| Орта | Дерек | Мақсат / іске қосу |
|---|---|---|
| Local | synthetic only | Developer, Node24 + Docker |
| CI ephemeral | synthetic only | GitHub Actions Postgres16, isolated playwright |
| Preproduction | synthetic/demo ғана | Екінші тарап UAT, 3 k6 сценарий, manual checklist |
| Production | нақты пайдаланушы дерегі (келісім болғанда) | Осы ЛЗ11-де сынақ дерегін салуға тыйым |

## NFR және k6 acceptance
- **N01**: дұрыс синтетикалық аккаунтпен login p95 ≤ 2000ms, 10 VU және ≥100 request; response success ratio ≥ 99%, өлшеу тек staging.
- **N02**: дайын 28 күндік жоспарға GET \`/api/plan/current\` p95 ≤ 10000ms, ≥100 request; жауап пайдаланушының өз жоспары. Бұл бастапқы N02 "Plan" мақсатындағы оқу-жоспар алу жолын өлшейді, generation уақытын жеке өлшеу керек.
- **N03**: /api/health 1 минуттық availability probe (сценарийдің тек техникалық proxy-і) ≥99.5%; толық 30 күндік login/plan/chat journey availability-ді осы қысқа тест растамайды.
- **N04**: 20 бөтен сұраныстың 0-і дерек ашпауы тиіс.
- **N07**: RPO ≤24 сағ, RTO ≤60 мин — мақсат, 08.11 тесті шағын DB-ге 2.236 сек, production кепілі емес.

Код: \`tests/load/lab11.js\`. Load test токендері \`K6_EMAIL\`, \`K6_PASSWORD\`, \`K6_BEARER_TOKEN\` — тек synthetic staging аккаунт, кодта/логта сақталмайды. Кілт жоқ болса сценарий тоқтайды, production default URL жоқ.

## Дефект тәртібі
| Severity | Уақыты | Қабылдауға әсері |
|---|---|---|
| Blocker: auth/owner leak/дерек жоғалту | бірден triage, release тоқтайды | UAT-қа жол жоқ |
| High: негізгі функция немесе backup бұзылды | ≤3 жұмыс күні | міндетті түзету/retest |
| Medium: қате UX, аударма | келесі вехаға дейін | issue + тәуекел |
| Low: косметика | backlog | жоспармен келісіледі |

GitHub Issue: ID, synthetic reproduction, expected/actual, severity, owner, deadline, reproduction evidence, fix commit, retest. Нақты адам дерегін қоспау.

## Шығу шарттары
Негізгі P1 UAT түгел pass; independent UAT протокол/қолы; CI quality/security жасыл; N04 теріс тексеру; backup/restore дәлелі; runbook-ты бөтен адам тексергені тіркелген. Қазір human UAT және тәуелсіз runbook rehearsal **орындалды деп расталмаған**.
