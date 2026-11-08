# ЛЗ 8 — SoW, SLO/SLA және эксплуатация құны

Дайын толық пакет: [SoW](../operations/lab8/sow.md), [SLI/SLO/SLA](../operations/lab8/slo-sla.md), [12 ай budget](../operations/lab8/budget.xlsx), [CSV](../operations/lab8/budget-12-months.csv), [input/results](../operations/lab8/assumptions-and-results.json), [3 hosting/36 ай](../operations/lab8/hosting-comparison.md), [портфолио 1–8](../portfolio/weeks-01-08.md).

08.11 addendum: contractor — осы үш студент, customer — fictional Qadam English. Нақты ұйымның қолы/шарты жоқ. SoW acceptance: critical flows, auth/owner gate,28 күн, backup,8 UAT. Customer міндеті: synthetic content/goldreview/test slots. Change request→impact estimate→Есқат шешімі→baseline. Existing open-source dependency лицензиялары сақталады; жаңа кодты беру қолданылатын repo лицензиясымен және команда келісімімен анықталады, сыртқы ұйымға IP берілді деп жазылмайды. Exclusions: payments/native/voice/certification.

Journey login SLO 99.5%≤2 s, plan 99%≤10 s, chat 98%≤15 s; SLA төмен 99/98.5/97. Error budget 30 күн: 10 000 valid attempt болса 50/100/200 failed allowed. Budget 50% consumed→release risk review, 100%→feature freeze, тек recovery/security. Denominator дұрыс invalidclient 400-ді servicefailure-ден ажыратады. Мониторингтің осы journey метрикалары production-та 30 күн жиналған жоқ; бұл target келісім.

Қайта тексерілетін бюджет: жылдық base 1 557 040 ₸,10%reserve 155 704, total 1 712 744. 100 MAU×12=1 200 user-month→1 427.29/user-month;24 000 operation→71.36/op. 200 manual−30 variable=170 contribution; fixed+setup/12 шығынын жабу ≈411 op/month, резервпен 460. Hosting 36 ай бірдей volume: public 4 599 120/private 5 290 000/org 3 882 000 base. Арзан org ресурс кепілдігі болмағандықтан автоматты таңдалмайды.

CloudApps тарифі — бұрынғы құжаттағы даталанған baseline, бүгінгі коммерциялық ұсыныс емес. Жеке сервердің 600 k/UPS 100 k және ұйымның 12 kshare — assumptions, сатып алу бағасының дәлелі емес. ЛЗ 3 initialdevelopment бұл операциялық бюджетке жасырын қосылмайды. Нақты deployment пен SLA қабылдауы алдында қайта quote, region және restore қажет.
