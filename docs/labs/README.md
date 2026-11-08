# AI English Analyzer — ЛЗ 1–13 портфолиосы

08.11.2026 · команда: **Азатұлы Есқат — PM/BA, Ақжан Расуул — Dev/AI, Исенов Диас — QA/DevOps**. Qadam English — пайдаланушы сұраған ойдан алынған оқу тапсырыс берушісі. Негізгі өнім: ағылшын диагностикасы → 28 күндік жоспар → жаттығу → прогресс.

13 DOCX толық мәтінінен талаптар шығарылды; [source manifest](source-manifest.json) файл hash-тарын сақтайды. [Талап–дәлел матрицасы](requirements-matrix.json) «жасалды», «оқу моделі», «human/externalpending» және «пайдаланушы кейінге қалдырды» мәртебелерін ажыратады. Әр reference-тегі бөтен «Заявка» жобасының атауын/сандарын осы өнімге механикалық көшірмедік.

| ЛЗ | Нәтиже |
|---|---|
|[1](lab-01.md)|10 вакансия, құзырет, gap-plan, MCOcase, жарғы|
|[2](lab-02.md)|өмірлік цикл, ADR, tracker, templates, wiki|
|[3](lab-03.md)|4 балама,3 жыл TCO/ROI/NPV/payback, sensitivity, notebook|
|[4](lab-04.md)|stakeholder, discoverymodel,18 story,14 NFR, storymap|
|[5](lab-05.md)|WBS, RACI, capacity,3 increment, dependencies, handover|
|[6](lab-06.md)|MonteCarlo 10000, percentiles, charts, poker, slide|
|[7](lab-07.md)|20 risk, RAID, STRIDE, EMV, нақты сканерлер|
|[8](lab-08.md)|SoW, SLO/SLA, errorbudget,12 ай budget, hosting|
|[9](lab-09.md)|2 sprintmodel, CFD, cycle/WIP, retro|
|[10](lab-10.md)|CI/CD, DORA, release/rollback|
|[11](lab-11.md)|unit/API/browser,9 UAT, postmortem, runbook|
|[12](lab-12.md)|AIbenchmark 30 cases,3 тәсіл, cost/privacy, go/no-go|
|[13](lab-13.md)|PMdraft 2 апта, allowlisteddata, schedule, verification|

Бастау: [жарғы](project-charter.md), [backlogboard](board.html), [іске қосу](runbook.md), [соңғы тексеріс](evidence/verification.json).

## Кодтағы өзгерістер
Жеке деректерге қолжетімділік JWT мен жазба иесі арқылы тексеріледі. Жаңа жоспар 28 күн мен 84 тапсырманы бір транзакцияда сақтайды. Тест нәтижелері тарихта қалады. AI жаттығуға бөлек рұқсат, серверде өшіру мүмкіндігі және анық белгіленген жалпы кеңес қосылды. Next.js/React жаңартылды, Docker қосымшасы root құқығынсыз жұмыс істейді. Тесттер мен CI тексерістері енгізілді.

## Адамның қатысуын талап ететін шарттар
Пайдаланушы AI-сыз режимді таңдады: нақты LLM тәжірибелері кейінге қалды. Нақты екі сұхбат, екі спринттің жұмыс журналы, тәуелсіз эталон бағалау, UAT қолтаңбасы және қолмен орындалған жұмыстың уақыт өлшемі әлі қажет. GitHub-та main тармағын қорғауды репозиторий әкімшісі орнатады. Бұлтқа орналастыру алдында инфрақұрылым үлгілеріндегі қалған қауіптер түзетіледі.

Дайын артефактілер мен ашық шарттар матрицада көрсетілген. Жергілікті тесттердің өтуі сыртқы қабылдау мен GitHub CI нәтижесін алмастырмайды. Құжаттағы болжамды кездесу мен мерзім нақты өткен оқиға ретінде көрсетілмейді.

`python scripts/labs/verify_portfolio.py` сілтемелерді, санақтарды және формулаларды қайта тексереді.
