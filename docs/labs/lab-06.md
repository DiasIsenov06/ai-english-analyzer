# ЛЗ 6 — ықтималдық жоспарлау

Толық орындалатын [notebook](../../notebooks/lab6_monte_carlo.ipynb), [runner](../../scripts/run_lab6.py), [10-story poker](../plan/lab6/planning-poker.md), [raw poker](../plan/lab6/poker-data.json), [forecast](../plan/lab6/forecast.json), [histogram](../plan/lab6/histogram.png), [CDF](../plan/lab6/cdf.png), [customer slide](../plan/lab6/customer-slide.pptx).

Bootstrap: 10 000 run, seed 42, throughput sample-ынан replacement, scope аяқталғанға дейін апталар қосылады. P 50/P 70/P 85/P 95 және даталар notebook output-та. Бұл sample — оқу моделінің дерегі, команданың нақты жылдамдығы емес; бастапқы қазан даталары тарихи baseline ретінде сақталады. 08.11 кейінгі commitment-ке дәл сол датаны қолдануға болмайды. Жаңа startDate қойып rerun және 2 нақты аптадан соң sample жаңарту керек.

Детерминистік жоспар average throughput-қа сүйенеді, ал bootstrap нөл/төмен апталардың құйрығын сақтайды; сондықтан P 85/P 95 кешірек. Poker-де 10 story, бастапқы дауыстар, қайшылық себебі және екінші раунд бар; сессия simulated деп белгіленген. Топ шын ойнады деген хаттама емес.

Customer message: «Бұл кепілдік дата емес. P 85 — осы assumptions жараса, модель run-дарының 85%-ы сол мерзімге дейін біткен. Scope өзгерсе, команда жүктемесі азайса немесе story өлшемі өзгерсе, қайта есептейміз». Reforecast: 20.11, owner Есқат. Scope +2 story тек қосып санаумен емес, same-size assumption және external block әсерімен қайта жүреді. 124 h жаңа scope, 14 item тарихи MVP және throughput бірлік айырмасы құжатта сақталады; оларды тікелей бөлуге болмайды.
