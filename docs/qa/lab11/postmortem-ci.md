# ЛЗ11 Postmortem: CI security issue (бақыланған, production емес)

**Оқиға PM-11:** 2026-11-04 GitHub Actions-тың \`docs/lab10-ci-dora\` тармағындағы тексерісі сәтсіз болды. Бұл пайдаланушыларға әсер еткен production outage **емес**. Нақты production downtime, зардап шеккен пайдаланушы саны және MTTR **өлшенген жоқ**.

## Дәлел және хронология (UTC)
- 04.11 09:36:07 — алғашқы CI run басталды, кейін failure: https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/41808839514 .
- 04.11 09:41:17 — жаңа push run: https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/41809314797 .
- Сол run кезінде Gitleaks өтті, Trivy HIGH/CRITICAL тексерісі **18 finding (15 HIGH, 3 CRITICAL)** берді; quality-де \`training/page.tsx:204\` apostrophe JSX lint қатесі.
- 04.11 09:45:09 — келесі PR CI run сәтсіз: https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/41809681574 . Lint түзетілгеннен кейін quality job green, security Trivy red.
- 08.11 — dependency/code жөндеулері және CI pipeline жаңартылған; main-дағы барлық job **success**: https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/42442525642 .
- 11.11 — кейінгі 9–11 лабораториялық есеп әзірлеу кезінде осы тарихи evidence талданды. Бұл дәл жаңа production incident болғанын білдірмейді.

## Әсер
Release gate алғашқы 04.11 run-дарда қызыл болды; \`image\` және \`deploy-staging\` орындалмады. Нақты production downtime=**жоқ деп өлшенбеген**, "0" деп бекітілмейді. Жоба пайдаланушысының жоғалтқан операциялары/санын GitHub Actions-тен шығару мүмкін емес. Тек CI job мәртебесі расталған.

## Не істеді (жүйе қасиеті)
1. Қорғалмаған npm/Next.js транзитивті тәуелділіктер CI security gate-ін бұзды.
2. JSX мәтініндегі апостроф линтер қақпасын жапты.
3. Test, secret scan және dependency scan бөлек job болғандықтан, қауіпсіздік ақауы көрінді.
4. Сканерді өшірмей, PR тексерісі қызыл қалды; кейін green қайта тексерілді.

## Жұмыс істеген шаралар
Gitleaks жасырын кілт анықтамады; Trivy толық finding санағын көрсетті; ESLint қатені нақты жолымен берді; соңғы 08.11 CI-де quality/security/image/deploy-staging job-тары сәтті.

## Үш follow-up шара (тексеріледі)
| ID | Іс-әрекет | Owner / мерзім | Нәтиже |
|---|---|---|---|
| PM11-A | Dependabot/security finding күнделікті triage, fixed vulnerabilities=0 blocked | Ақжан Расуул / 18.11.2026 | security job green, қалған finding Issue-ге |
| PM11-B | Login/plan critical path үшін synthetic smoke + alert тексеру | Ақжан Расуул / 20.11.2026 | staging health probe, ≥99.5% sample |
| PM11-C | Басқа адам runbook-ты өз бетінше орындасын, actual duration жазылсын | Ақжан Расуул / 25.11.2026 | қол қойылған PASS/FAIL протоколы |

Статус: **ұсынылған**, GitHub Issue тізімінде тіркелгеннен кейін нақты issue URL-імен байланыстырылады. Адамды кінәламай, ақауға себеп болған жүйелік қақпаларды талдаймыз.

**Дереккөз:** жоғарыдағы нақты GitHub run URL-дары, 08.11 ішкі evidence \`docs/labs/evidence/verification.json\`.
