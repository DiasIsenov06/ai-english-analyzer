# ЛЗ 9 — flow metrics және ретроспектива

[Екі sprint моделі](../plan/lab9/README.md), [timestamp CSV](../plan/lab9/simulated_transition_log.csv), [метрика коды](../../scripts/lab9_metrics.py), [нәтиже](../plan/lab9/metrics.json), [күндік WIP](../plan/lab9/daily_wip.csv), CFD SVG файлдары сол каталогта. **Деректер оқу симуляциясы; нақты екі sprint tracker export емес.** Нақты екі аптаны артқа қарай ойдан толтырмаймыз.

Қате түзету: WIP тек біткен task-тардан саналмауы тиіс. 08.11 runner аяқталмаған started task-тарды window end-ке дейін қосады. Mean/p 85 cycle completed cohort үшін; censored items age бөлек қаралады. Time unit: жұмыс күндері 09–17, Mon–Fri, percentile linear inclusive. CFD бірінші sprint-тегі 6 және екіншідегі 8 task-ты қамтиды. Done count — throughput, sprint жоспарымен шатастырылмайды.

Little L=λW тек стационарлық boundary/бірлік үйлессе қолданылады. 5 күндік finite window мен unfinished tail кезінде теңдік міндетті емес; айырма математикалық қате деген сөз емес. Кіші sample-дағы p 85 тұрақсыз, actual baseline-ды алмастырмайды.

Бір ғана retro action: **күн сайын 15:00–15:20 review slot, owner Диас, бастау 16.11, тексеру 20.11**. Target review_mean≤0.75 day және WIP≤6. Модельдегі before/after — [retrospective](../plan/lab9/retrospective.md); actual effect әлі өлшенген жоқ. Жаңа ықтимал bottleneck: Ready-ге нақты acceptance келмеуі; келесі аптада age/blockedreason бақыланады, осы ретрода екінші action қосылмайды.

Actual жинау рәсімі: issueID, owner, iteration, ready/start/review/done timestamps UTC, blocked intervals; status ауысуын сол сәтте жазу. Export-ты readonly snapshot+commitSHA/date-пен сақтау, соңғы 48 сағат өзгерістерін audit. Екі нақты sprint талапты жабу үшін команда осы журналды жүргізуі керек.
