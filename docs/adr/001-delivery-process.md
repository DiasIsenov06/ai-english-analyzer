# ADR-001 — шағын команда үшін Kanban және инкременттік gates
Күні: 08.11.2026. Status: accepted for educational implementation. Decision owner: Азатұлы Есқат. Бұл нақты sponsor approval емес.

Context: дайын Next.js өнімін үш студент кеңейтеді; оқу жүктемесі өзгермелі, AI сапасы белгісіз, тексерілетін артефактілер қажет. Drivers: шағын capacity, тез feedback, дерек қауіпсіздігі, traceability, fixed оқу горизонты.

Options: (A) толық Waterfall — өзгеріс құны жоғары, AI тәжірибесі кеш ашылады; (B) толық Scrum — үш адамның толық емес жүктемесіне ceremonies/commitment артық; (C) Kanban + release gates — таңдалды. Бір апталық review, жеке WIP2, release I 1/I 2/I 3, auth және UAT gate.

Positive: blocked жұмысы көрінеді, кішкентай тапсырма тез тексеріледі, релизге дәлел бар. Negative: sprint velocity мағынасы әлсіз; continuous flow-ды күшті PO тәртібі ұстайды; WIP бұзылса болжам нашарлайды. Consequences: throughput/cycle time жинау, story өлшемін ≤8 h ұстау, simulation мен actual деректерін бөлу.

Verification: екі нақты аптадан кейін p 85 cycle≤3 жұмыс күні және WIP≤6 күндердің ≥90%; орындалмаса review slot/өлшемді өзгерту. 20.11.2026 қайта қарау, owner Есқат. Бастапқы модельдегі жақсару actual нәтиже болып есептелмейді.
