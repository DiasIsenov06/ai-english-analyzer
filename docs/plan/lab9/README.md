# 9-зертханалық жұмыс · AI English Analyzer

**Тақырып:** Екі спринтті симуляциялау. **Мәртебе:** ОҚУ СИМУЛЯЦИЯСЫ, GitHub Projects экспортындағы нақты ағын емес.

Репозиторий: https://github.com/DiasIsenov06/ai-english-analyzer  
Жобаға байланысты ашық жұмыстар: [SEC-01 #2](https://github.com/DiasIsenov06/ai-english-analyzer/issues/2), [SEC-02 #3](https://github.com/DiasIsenov06/ai-english-analyzer/issues/3), [SEC-03 #4](https://github.com/DiasIsenov06/ai-english-analyzer/issues/4). Симуляция оларды жаппайды.

## Құжаттар
- [process-policies.md](process-policies.md) — баған ережелері, WIP, DoR, DoD.
- [simulated_transition_log.csv](simulated_transition_log.csv) — 14 модельдік тапсырманың уақыт журналы.
- [retrospective.md](retrospective.md) — бір өлшенетін әрекеті бар ретроспектива.
- [metrics.json](metrics.json) — метрикалар.
- [task_metrics.csv](task_metrics.csv), [daily_wip.csv](daily_wip.csv) — қайта есептелетін кестелер.
- [cfd-sprint-1.svg](cfd-sprint-1.svg), [cfd-sprint-2.svg](cfd-sprint-2.svg) — CFD диаграммалары.
- [scripts/lab9_metrics.py](../../../scripts/lab9_metrics.py) — есептеу коды.

## Екі спринт — **модельденген** нәтиже

| Метрика | Спринт 1 (12–16.10) | Спринт 2 (19–23.10) |
|---|---:|---:|
| Жоспарланған тапсырма | 6 | 8 |
| Throughput (Done) | 4 | 6 |
| Cycle time орташа, жұмыс күні | 2,5938 | 1,2500 |
| Cycle time p85, жұмыс күні | 3,1500 | 1,6250 |
| Review орташа, жұмыс күні | 1,6562 | 0,5625 |
| Орташа WIP | 2,0750 | 1,5000 |
| Little заңының оң жағы | 2,0750 | 1,5000 |

Спринт 1-де Review жиналуы — модельдің тар орны. Спринт 2-де бір өзгеріс енгізілді: **09:00 review-first**, модельде Review уақыты 66% қысқарды. Бұл нақты команданың өнімділігін дәлелдемейді.

## Қалай тексереміз

```bash
python scripts/lab9_metrics.py
```

Код Python стандартты кітапханасын пайдаланады; metrics.json, CSV және SVG диаграммаларын қайта есептейді. Қолданылатын күнтізбе: 09:00–17:00, дүйсенбі–жұма; 1 жұмыс күні = 8 сағ. p85 сызықтық интерполяциямен есептеледі.

**Нақты нәтиже алу үшін:** GitHub Projects Board-та статустарды, WIP лимиттерін, Iteration/Owner-ді енгізіп, екі шынайы спринт бойынша ауысу даталарын экспорттау қажет. Бұл файлдар дайын күйінде нақты өткен екі спринт ретінде ұсынылмайды.

**Word есебі:** «Ақжан Расуул АЖ-47 лаб9.docx» ChatGPT-та бөлек берілген; осы commit-терге бинарлық Word файлы қосылған жоқ.

Дереккөздер: 2026 жылғы қазанның методичкасы (ЛЗ9, 19–20 бет); репозиторийдің алдыңғы ЛЗ5–ЛЗ8 материалдары. Мәтін және кодты әзірлеуге ChatGPT пайдаланылды; барлық модельдік деректер ашық белгіленген.
