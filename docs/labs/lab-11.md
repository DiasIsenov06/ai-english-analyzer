# ЛЗ 11 — сапа, UAT, postmortem, runbook

Стратегия: unit(auth, JWT, input boundaries) → route integration(mock DB, ownership, atomic write) → API E2E(шын PostgreSQL 16) → browser(Chromium,390 px) → human UAT. Tools: Vitest 5, Playwright, pytest, npm audit, Trivy, Gitleaks. Node 24, Next 15, isolated localhost:55432/aea_lab_test; барлық email `example.invalid`, пароль synthetic; remote Neon-ға test жазуы жасалмайды. Production seed/restore орындалмайды.

08.11 нақты local evidence: 27 unit/route test;3 E2E;10 DORA test. Auth/validation coverage — таңдалған 3 файлда 100%lines/97.36%branches, бүкіл қолданба coverage-сы емес. DORA 92.06%. Lint warnings 0, production build өтті. Соңғы дәлелдер [verification](evidence/verification.json) және [runbook](runbook.md); қайталанған run санақтары сол файлда басым.

## User acceptance (адам тілімен)
| ID / priority | Сценарий | Қабылдау шарты | Автомат / Human |
|---|---|---|---|
| U 01 P1 | Жаңа оқушы тіркеледі және кіреді | дұрыс парольмен кабинет; әлсіз/қате пароль түсінікті бас тартады | API/browser pass; human pending |
| U 02 P1 | Тестті аяқтайды, қайта тапсырады | екі нәтиже тарихта, score дұрыс диапазонда | API pass; human pending |
| U 03 P1 | Алғашқы жоспар алады | 28 күн, әр күні 3 task; екінші create бұрынғысын сақтайды | unit/API pass; human pending |
| U 04 P1 | Өз күнін аяқтайды | қайта ашқанда күн мен 3 task completed | API pass; human pending |
| U 05 P1 | Екі оқушының дерегі бөлінеді | басқа dayId 404, өзге тарих көрінбейді | unit/API pass; human pending |
| U 06 P1 | AI-сыз жаттығады | хабарлама сақталады, жалпы кеңес белгіленеді; sessionfinish | API/browser pass; human pending |
| U 07 P2 | Телефон өлшемінде ақпарат оқиды |390 px көлденең scroll жоқ, checkbox keyboard қолжетімді | browser partial; human pending |
| U 08 P1 | Оператор backup қалпына келтіреді |жеке DB row counts бірдей, source өзгермейді | Docker rehearsal pass; human pending |
| U 09 P2 | Сөздік пен грамматикадан оқиды |сөз/мысал/ереже түсінікті; бос күйде crash жоқ | human/content review pending |

Human protocol: date, participant role+consent, appSHA, environment, U 01..09 actual/result/evidence, defect IDs, accept/reject decision, reviewer signature. Қолтаңба ойдан толтырылмайды. UAT exit: барлық P1 pass, P2 exception owner/date, externalAI off until gold validated. Автоматты E2E нақты әдіскер қолын алмастырмайды.

## Postmortem PM-01 — ownership тексеруінің жетіспеуі
Бұл production intrusion туралы есеп емес: 08.11 code review-де табылған latent security defect. Әсер ететін беттер: plan, current/day, test-results, studyactivity, onboarding. Нақты зардап шеккен адам саны белгісіз; 0 деп растамаймыз. Жеке адамның кінәсі емес, contract және testcoverage бос орны.

Хронология: GitHub docs branches біріктірілді → route-та client userId-ге сену анықталды → token-derived identity және owner query енгізілді → 01:53 UTC unit suite 27 pass → 02:07 UTC шамасында isolated API/browser 3 pass → productionbuild pass. Нақты өндірістік incident start/recovery уақыты жоқ, сондықтан DORA MTTR-ға қосылмайды.

Түбір факторлар: UI ProtectedRoute серверлік authorization деп қабылданған; route implementations қайталанған; negative cross-user test болмаған. Жеңілдеткен жағдай: .env gitignored және тест жеке DB-де өтті. Release бұрынғы негізгі идеяны сақтайды.

| Action | Owner / due | Backlog | Тексерілген әсер |
|---|---|---|---|
| Signed owner барлық жеке route-та | Расуул /08.11 |US 04–07, SEC 01 |бөтен PATCH 404, DB өзгермейді |
| Missing secret fail-closed + startcheck | Диас /08.11 |US 14, SEC 01 |unit secret tests; prestart validation |
| Әр PR negative ownership gate | Диас /13.11 |US 14 |CI unit/E2E wired; remote run pending |

Runbook-ты басқа команда мүшесі fresh checkout-та 30 мин ішінде қайталап, өзі signature қоюы керек. Авторлық автоматты rehearsal өтті, тәуелсіз human rehearsal әлі жоқ.
