# ЛЗ11 — GitHub-тың тексерілген нәтижелері (11.11.2026)

- [Pull Request #8](https://github.com/DiasIsenov06/ai-english-analyzer/pull/8), branch `docs/lab11-qa-uat-runbook`.
- [Негізгі CI 42997259960](https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/42997259960): **success** (PR). Бұл жаңа PR үшін автоматты CI дәлелі.
- [Synthetic QA checks 42997259606](https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/42997259606): **success** (PR); seed=42 сынақтары орындалған.
- [Synthetic QA checks 42997188052](https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/42997188052): **success** (feature branch push).
- GitHub main бойынша алдыңғы [CI 42442525642](https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/42442525642): success, оның ішінде уақытша staging. Бұл production емес.

## Postmortem-нен алынған үш Issue

| Бақылау | GitHub Issue | Иесі және мерзімі | Status |
|---|---|---|---|
| PM11-A: Security dependency triage | [#9](https://github.com/DiasIsenov06/ai-english-analyzer/issues/9) | Rasuul255, 18.11.2026 | open / planned |
| PM11-B: Synthetic smoke + monitor | [#10](https://github.com/DiasIsenov06/ai-english-analyzer/issues/10) | Rasuul255, 20.11.2026 | open / planned |
| PM11-C: Independent runbook rehearsal | [#11](https://github.com/DiasIsenov06/ai-english-analyzer/issues/11) | Rasuul255, 25.11.2026 | open / planned |

**Ашық талаптар:** сыртқы UAT қатысушысы/қолтаңбасы жоқ; k6 latency нақты өлшенбеді; runbook тәуелсіз тексерілмеді. GitHub CI green бұл міндеттер орындалды дегенді білдірмейді.
