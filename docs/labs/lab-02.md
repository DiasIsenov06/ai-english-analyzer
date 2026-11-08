# ЛЗ 2 — өмірлік цикл, ADR және жұмыс кеңістігі

| Критерий | Мемлекеттік тендер | Mobile startup | Банк migration |
|---|---|---|---|
| Белгісіздік | scope төмен, интеграция орта | нарық/UX жоғары | ескі дерек/тәуелділік жоғары |
| Қате құны | қабылдау/мерзім айыбы | гипотеза шығыны, тез қайту | төлем/дерек қатесі өте жоғары |
| Регламент | келісім/сатып алу gates | жеңіл, дерек қорғау қалады | audit, segregation, rollback |
| Customer maturity | формалды талап болуы мүмкін | PO күн сайын қолжетімді | бірнеше бизнес owner |
| Команда таралуы | мердігер/ведомство бөлек | 1 шағын команда | көп vendor және IT ops |
| Келісім | fixed scope/milestones | time-and-materials | phased acceptance + SLA |
| Таңдау | predictive baseline + ішкі iterations | Scrum/Lean experiments | hybrid, V-model test gates |
| Каденс | 2 апта демо, айлық gate | 1 апта build/measure | 2 апта demo, rehearsal/cutover gate |
| Қайта қарау trigger | change >10% scope | 2 тәжірибе мақсатқа жетпесе | reconcile mismatch >0 немесе RTO бұзылса |

Біздің жоба: бір апталық Kanban delivery + үш инкременттік қабылдау gate. Неге және салдары: [ADR-001](../adr/001-delivery-process.md). Статустар: Backlog → Ready → In progress → Review → Done; Blocked бөлек себеппен. Бір адамға белсенді WIP ≤2, жалпы ≤6; blocked те лимитте. Review кезегі >2 болса жаңа жұмыстан бұрын review. Done: acceptance + тест + review + құжат + қауіпсіздік қақпасы.

Артефактілер: [backlog](data/backlog.json), [board](board.html), [story map](story-map.md), [wiki](../wiki/README.md), `.github/ISSUE_TEMPLATE`, PR template. JSON — versioned жергілікті tracker, статустары код дәлеліне сүйенген. GitHub Projects-та тақта құрылды деп көрсетілмейді; remote issue #2–4 бұрыннан бар. Views: status board, iteration table, risk filter. Мұғалімге public repo read access жеткілікті; private кеңістікке нақты account invite керек болса owner орындайды.

DoR: мақсат/actor, GWT positive+negative, Size, Owner, Iteration, dependency және RiskID; ≥8 h story бөлінеді. Naming: `feat/auth-owner`, `fix/plan-28`, PR `US-xx: нәтиже`, осы жұмыс branch `codex/labs-1-13`. Құжат өзгерісі де review өтеді. Ready күйіне тек орындалатын шағын story өтеді. Blocked: owner, next action және review date міндетті. Апта сайын дүйсенбі 15 мин planning, күн сайын async 3 жол status, жұма 20 мин demo + 15 мин retro (жоспарланған, өткен кездесу емес).
