# ЛЗ 3 — бизнес-кейс және инвестиция

Проблема: әдіскердің диагностика/жоспар/feedback жұмысы қайталанады. Qadam English сценарийі: 100 MAU, 2 000 әрекет/ай, қолмен бір әрекет 200 ₸, жылына 4.8 млн ₸. Бұл сұхбатпен өлшенбеген бизнес гипотеза. Оқу нәтижесінің пайдасы ақшаға қайта қосылмайды.

4 балама: ештеңе өзгертпей қолмен жұмыс; дайын SaaS сатып алу; open-source LMS бейімдеу; бар AI English Analyzer-ді кеңейту. Соңғысы таңдалды: дайын негізгі жол, source бақылауы, төмен initial cost. SaaS бағасы vendor quote емес (200 k/ай assumption), OSS лицензиясы нөл болғанымен интеграция/қолдау тегін емес. Do nothing initial zero болғанымен 14.4 млн/3 y manual expense бар.

[Орындалған формулалар/нәтиже](economics-results.md), [барлық жолдар Year 0–3](data/economics.json), [Jupyter notebook](../../notebooks/lab3_business_case.ipynb), [runner](../../scripts/labs/economics.py). Development, infrastructure, licenses/AI, migration, training, support/review, decommission — әр балама үшін әр жылда жеке жол, жоқ жерде 0.

Баға негізі: developer 3 000 ₸/h және full-product 420 h — оқу бағалауы; infrastructure 513 040/y және AI 120 000/y — ЛЗ 8 бұрынғы baseline-ымен бірдей; support 288 000 admin +600 000 human review/y. Migration 36 k және training 24 k initial; decommission 60 k final. Үш жыл бағасы өзгермейді деген гипотеза, VAT/инфляция жеке енгізілмеген. Тарифтің тарихи сілтемелері [ЛЗ 8](../operations/lab8/README.md). Бұл жердегі 420 h толық өнім құнын, жарғыдағы 124 h қалдық delivery scope-ын білдіреді.

NPV 15%, ROI, payback, айлық delay cost және +30%cost/−50%benefit/екеуі бірге сценарийі кодпен есептеледі. Тәуекел: manual минутты қысқарту міндетті түрде төленетін еңбек шығынын қысқартпайды; көлем 2 000-ға жетпесе break-even өзгереді. Decision: шектеулі pilot go; commercial go тек manual timing, retention және acceptance расталса. Ең нашар sensitivity-де NPV теріс болуы мүмкін — нәтиже жасырылмайды.

## 5 минуттық sponsor қорғау сценарийі
0:00–0:45 проблема және baseline гипотезасы; 0:45–1:30 төрт балама; 1:30–2:30 TCO/NPV/payback; 2:30–3:30 sensitivity және break-even; 3:30–4:15 scope және қауіптер; 4:15–5:00 сұралатын шешім: синтетикалық pilot, measured baseline-ға дейін коммерциялық міндеттеме жоқ. Сұрақтар: «пайда жарты болса?», «өзіміз қызмет көрсете аламыз ба?», «AI-сыз жұмыс істей ме?». Жауап есеп пен runbook-та. Қорғау өткізілді деген бейне/қолтаңба жоқ.

Жарғы: [project-charter.md](project-charter.md).
