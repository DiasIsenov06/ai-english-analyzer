# ЛЗ 7 — тәуекел, RAID және қауіпсіздік

[20 тәуекел](../security/risk-register.json), [pre-mortem](../security/pre-mortem.md), [top 5 response](../security/response-plans.md), [RAID A/I/D бөлек](../security/raid-other.json), [STRIDE](../security/stride.md), [trust-boundary диаграммасы](../security/threat-model.svg), [compliance inventory](../security/compliance.md). Бұл 14.10 бастапқы baseline; 08.11 delta төменде. Ескі scanner саны жаңа күйдің дәлелі емес.

STRIDE компоненті — plan API: browser→HTTP API, API→DB, server→AI — trust boundaries. Spoofing→JWT; Tampering→owner/range validation; Repudiation→request audit қажеттігі; Information disclosure→query owner және қысқа log; DoS→input bound/timeout (distributed rate limit әлі жоқ); Elevation→бөтен dayId теріс тест. Сәйкестігі регистрде.

| Top 5 | Owner v 2 | Қазіргі әрекет / trigger | Review |
|---|---|---|---|
| R01 owner bypass | Расуул | auth+owner fix; cross-user 2 xx болса stop | 13.11 |
| R02 JWT fallback | Расуул | secret fail-closed; missingconfig start алса stop | 13.11 |
| R03 dependencies | Диас | runtime update + скан; HIGHfixable>0 болса gate | әр PR |
| R04 data region/AI | Есқат | local synthetic pilot; нақты дерекке негіз жоқ болса AIoff | 20.11 |
| R06 7/28 scope | Есқат | жаңа жоспар 28; legacy migration бөлек | 13.11 |

Қалған personal owners: delivery/requirements R07, R09, R13, R20 — Есқат; R08, R10, R16, R17, R19 — Расуул; R05, R11, R12, R14, R15, R18 — Диас. Стратегия/ықтималдық/әсер/trigger бастапқы JSON-да; жаңа residual probability дәлелсіз төмендетілмейді.

EMV=Σp×impact=38.4 h. Бағалау ставкасы 3 000→115 200 ₸; management 6 h→18 000 ₸, жалпы 133 200 ₸. Уақыт capacity-ге әсері [ЛЗ 5](lab-05.md):18.4 h gap. Management reserve-ті Есқат тек жаңа белгісіз қауіпке decision log арқылы бөледі; белгілі рискке EMV қоры. Ықтималдықтар эксперттік модель, тәуелсіз оқиға емес; EMV worst-case кепіл емес.

Үш бұрыннан бар mitigation issue: [SEC 01](https://github.com/DiasIsenov06/ai-english-analyzer/issues/2), [SEC 02](https://github.com/DiasIsenov06/ai-english-analyzer/issues/3), [SEC 03](https://github.com/DiasIsenov06/ai-english-analyzer/issues/4). Local fix remote issue жабылды дегенді білдірмейді. Current evidence `docs/labs/evidence/` ішінде, тек нақты run бар жерде pass жазылады.

Data: email/password hash, level/goal, scores, plan, чат. AI opt-in UI, server AI_ENABLED=false, 4 k input/12 s timeout; жеке email AI payload-қа қосылмайды, бірақ еркін мәтінде PII болуы мүмкін. Нақты pilot алдында consent/lawful basis, сақтау аймағы, TTL/delete/backup policy, access review және human review бекітіледі. Remote Neon EU deployment — Қазақстандағы сақтаудың дәлелі емес. Құқықтық сәйкестік сертификаты берілмейді. Automated retention job және толық audit pipeline жоқ болса, олар орындалды деп белгіленбейді.
