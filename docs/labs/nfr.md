# 14 функционалдық емес талап
Бәрі — acceptance target; «код бар» жүктеме/SLA дәлеліне тең емес.

| ID | Санат | Өлшем / қақпа | Тексеру және owner |
|---|---|---|---|
| N01 | Performance | Login p 95≤2 s, 100 request/10 users | staging load, Диас |
| N02 | Performance | Plan p 95≤10 s, 100 request | staging load, Диас |
| N03 | Availability | login 99.5%, plan 99%, chat 98%, 30 күн | journeys monitor, Диас |
| N04 | Security | бөтен дерекке 0 success/20 attack cases | API negative suite, Расуул |
| N05 | Security | түзетілетін HIGH/CRITICAL=0 | Trivy/npm audit gate, Диас |
| N06 | Privacy | opt-out кезінде 0 сыртқы AI request | fetch spy + E2E, Расуул |
| N07 | Recoverability | RPO≤24 h, RTO≤60 min | timed isolated restore, Диас |
| N08 | Accessibility | keyboard critical path, 0 serious axe finding | manual + axe, Есқат |
| N09 | Compatibility | Chrome/Edge desktop және 390 px width-та critical flow | Playwright + visual, Диас |
| N10 | Maintainability | auth/validation coverage≥80 lines/70 branches | coverage scoped report, Диас |
| N11 | Reliability | invalid input 400; provider timeout≤12 s + fallback | fault injection, Расуул |
| N12 | AI quality | macro-F1≥.85, each class F1≥.75, reviewed gold≥30 | benchmark + human review, Расуул |
| N13 | Observability | 3 journey attempts/success/duration, no message/email in metrics | sample logs/metrics, Диас |
| N14 | Portability | fresh Node 24/Postgres 16 setup≤30 min | independent runbook rehearsal, Диас |

N03/N07/N08/N09/N12/N13/N14 толық pilot дәлелін талап етеді. Local unit pass өндірістік SLO-ны растамайды. Жауап беру уақыты cold-start және provider қосылған күйде бөлек өлшенеді.
