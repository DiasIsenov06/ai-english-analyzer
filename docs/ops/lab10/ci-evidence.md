# ЛЗ10 — GitHub Actions бойынша нақты тексеріс (04.11.2026)

- Branch: `docs/lab10-ci-dora`, PR: [#6](https://github.com/DiasIsenov06/ai-english-analyzer/pull/6).
- [Алғашқы CI run](https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/41808839514): **failure**. `quality`: npm ci / prisma validate сәтті, ESLint қатесі `src/app/training/page.tsx:204` мәтініндегі апостроф. Бұл осы branch-те HTML entity-мен түзетілді.
- [Екінші CI run](https://github.com/DiasIsenov06/ai-english-analyzer/actions/runs/41809314797): **failure**. `security`: Gitleaks сәтті; Trivy HIGH/CRITICAL сканері **18** осалдық (15 HIGH, 3 CRITICAL) тапқан. Next.js 14.2.35, nanoid 3.3.11 және басқалары қатысты. Бұл нақты security blocker, сканерді сөндіріп **жасыл** нәтижені қолдан жасауға болмайды.
- `image` / `deploy-staging` орындауға жетпеді, демек deployment **0**, lead time, CFR және MTTR **Н/Д**.
- Жаңа commit-тен кейін Actions-тің жаңа job күйі қайта тексеріледі; осы файлдағы бұрынғы қызыл нәтижелер тарихи дәлел ретінде қалады.

## Түзету жоспары
1. Тәуелділіктерді қауіпсіз қолдау нұсқаларына, Next.js ірі нұсқасы өзгергенде breaking changes-ті ескере отырып, *бөлек* PR арқылы жаңарту.
2. Trivy нәтижелерін әр CVE/GHSA бойынша тексеру; шынымен relevant vulnerability мен mitigation-ды Issue #3 журналына жазу. HIGH/CRITICAL қақпасы сақталады.
3. `quality`, `security`, `image` job-тары жасыл болғанын, содан кейін ғана main merge мен ephemeral staging табысын растау.
4. Repo admin `main` ruleset: 1 approval және міндетті CI checks баптайды; қосылымның әкімшілік рұқсаты жоқ кезде оны орындалды деп белгілемейміз.

**Маңызды:** бұл есеп production жүйеге жасалған deployment емес, GitHub-тағы тексеру нәтижесі.
