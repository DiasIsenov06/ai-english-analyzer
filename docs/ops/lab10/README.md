# ЛЗ10 — CI/CD + DORA (AI English Analyzer)

**04.11.2026**: Python эталондағы қосымша код емес, бұл жоба Next.js 14/TypeScript/Prisma; Python тек DORA есептеуіне қолданылады.

## Артефакттар
- CI: [.github/workflows/ci.yml](../../../.github/workflows/ci.yml)
- DORA: [scripts/dora.py](../../../scripts/dora.py); тест [tests/lab10/test_dora.py](../../../tests/lab10/test_dora.py)
- [dashboard.html](dashboard.html) және [metrics.json](metrics.json)
- [release-and-rollback.md](release-and-rollback.md)
- [incidents.csv](incidents.csv) және [incident-verification.json](incident-verification.json)

## Анықтамалар және бастапқы өлшем
Deployment = main-дағы тек сәтті аяқталған deploy-staging job (GitHub runner-де уақытша Docker стенд). Success CI **deployment емес**. 04.11.2026 аудитінде GitHub Actions-та workflow run жоқ, сондықтан бастапқы 28 күнде deploy = 0, frequency = 0/апта. Lead time, change failure rate, MTTR — **Н/Д** (қажетті нақты дерек жоқ).

Lead time: committer timestamp-тен job аяқталуына дейін медиана.
CFR: 24 сағат ішінде түзету/откат талап еткен расталған деплой үлесі; толықтығы расталған incident журналы қажет.
MTTR: нақты инциденттің detected_at → recovered_at медианасы.

Токен тек GH_TOKEN environment variable түрінде оқылады, құпия кодта сақталмайды.
Өзектендіру: python scripts/dora.py. Тек нөлдік snapshot-ты қайталау (API емес): python scripts/dora.py --offline 2026-11-04T09:00:00Z.

Талап: Rulesets-та PR, бір review, quality/security/image міндетті check және қызыл тексерістің merge блоктайтынын растау. Бұл әкімшілік баптаулар автоматты түрде орнатылды деп жазылмайды.

Жақсарту мақсаттары (факт емес): 18.11.2026 дейін >=1 staging deployment/апта және lead <=6 сағ; 02.12.2026 дейін (кемінде 10 deployment кезінде) CFR <10% және дәлелденген MTTR <=1 сағ.

AI қолдану: ChatGPT жоспарлау және есептеу мәтініне қолданылған; тест пен production deployment нәтижелері ойдан шығарылмайды.
