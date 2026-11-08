# ЛЗ 4 — 18 user story

INVEST: actor/value айқын, API/UI бөлек тексеріледі, 3–8 h, acceptance өлшенеді. Тәуелділік map-та; бағалар жоспар, actual емес.

## US-01 — Тіркелу
жаңа оқушы ретінде аккаунт ашу үшін осы мүмкіндікті қалаймын.

- Epic: auth; Size: 5 h; Owner: Ақжан Расуул; Iteration: I 1; Risk: R02.
- Positive: Given жарамды email және ≥8 таңбалы пароль; When тіркелгенде; Then профиль және токен беріледі.
- Negative: Given әлсіз пароль; When сұрау орындалғанда; Then 400 және аккаунт құрылмайды.

## US-02 — Кіру
оқушы ретінде өз кабинетіме кіру үшін осы мүмкіндікті қалаймын.

- Epic: auth; Size: 3 h; Owner: Ақжан Расуул; Iteration: I 1; Risk: R02.
- Positive: Given тіркелген аккаунт; When дұрыс парольмен кіргенде; Then өз профилім ашылады.
- Negative: Given қате пароль; When сұрау орындалғанда; Then 401, токен жоқ.

## US-03 — Бастапқы тест
оқушы ретінде деңгейді білу үшін осы мүмкіндікті қалаймын.

- Epic: diagnostic; Size: 8 h; Owner: Ақжан Расуул; Iteration: I 1; Risk: R09.
- Positive: Given тест ашық; When жауаптарды аяқтағанда; Then score/total және деңгей көрінеді.
- Negative: Given жауап жетіспесе; When сұрау орындалғанда; Then submit болмайды.

## US-04 — Тарих
оқушы ретінде ілгерілеуді салыстыру үшін осы мүмкіндікті қалаймын.

- Epic: diagnostic; Size: 5 h; Owner: Ақжан Расуул; Iteration: I 1; Risk: R01.
- Positive: Given екі тест нәтижем бар; When тарихты ашқанда; Then екі жеке attempt сақталған.
- Negative: Given өзге токен; When сұрау орындалғанда; Then өзгенің нәтижесі көрінбейді.

## US-05 — Жоспар
оқушы ретінде әлсіз дағдыны дамыту үшін осы мүмкіндікті қалаймын.

- Epic: plan; Size: 8 h; Owner: Ақжан Расуул; Iteration: I 1; Risk: R06.
- Positive: Given өз нәтижем бар және жоспар жоқ; When жоспар жасағанда; Then 28 күн және 84 тапсырма сақталады.
- Negative: Given токенсіз; When сұрау орындалғанда; Then 401, жазу жоқ.

## US-06 — Күн тапсырмасы
оқушы ретінде бүгінгі жұмысымды көру үшін осы мүмкіндікті қалаймын.

- Epic: plan; Size: 5 h; Owner: Ақжан Расуул; Iteration: I 1; Risk: R01.
- Positive: Given өз жоспарым бар; When 1..28 күнді ашқанда; Then сол күн тапсырмалары көрінеді.
- Negative: Given day=29; When сұрау орындалғанда; Then 400.

## US-07 — Аяқтау
оқушы ретінде прогресті сақтау үшін осы мүмкіндікті қалаймын.

- Epic: plan; Size: 5 h; Owner: Ақжан Расуул; Iteration: I 2; Risk: R01.
- Positive: Given өз күнім ашық; When аяқталды деп белгілегенде; Then күн мен task бірге жаңарады.
- Negative: Given бөтен dayId; When сұрау орындалғанда; Then 404 және өзгеріс жоқ.

## US-08 — Сөздік
оқушы ретінде жаңа сөзді үйрену үшін осы мүмкіндікті қалаймын.

- Epic: practice; Size: 5 h; Owner: Ақжан Расуул; Iteration: I 2; Risk: R09.
- Positive: Given сөздер жүктелген; When сөзді ашқанда; Then аудармасы мен мысал көрінеді.
- Negative: Given дерек жоқ; When сұрау орындалғанда; Then бос күй қате шығармайды.

## US-09 — Грамматика
оқушы ретінде ережені түсіну үшін осы мүмкіндікті қалаймын.

- Epic: practice; Size: 5 h; Owner: Ақжан Расуул; Iteration: I 2; Risk: R09.
- Positive: Given сабақ бар; When ашқанда; Then ереже және мысал көрінеді.
- Negative: Given сабақ жоқ; When сұрау орындалғанда; Then түсінікті бос күй.

## US-10 — AI чат
оқушы ретінде жазбама кері байланыс алу үшін осы мүмкіндікті қалаймын.

- Epic: ai; Size: 8 h; Owner: Ақжан Расуул; Iteration: I 2; Risk: R08.
- Positive: Given AI-ға рұқсат бердім; When қысқа сөйлем жібергенде; Then түзету және келесі қадам келеді.
- Negative: Given провайдер timeout; When сұрау орындалғанда; Then ережелік жауаппен жалғасады.

## US-11 — AI сөндіру
оқушы ретінде сыртқы сервиссіз жаттығу үшін осы мүмкіндікті қалаймын.

- Epic: ai; Size: 3 h; Owner: Ақжан Расуул; Iteration: I 2; Risk: R04.
- Positive: Given чат ашық; When AI тетігін өшіргенде; Then жаңа мәтін провайдерге жіберілмейді.
- Negative: Given сервер AI_ENABLED=false; When сұрау орындалғанда; Then client қоса алмайды.

## US-12 — Сессия аяқтау
оқушы ретінде жаттығуды бітіру үшін осы мүмкіндікті қалаймын.

- Epic: practice; Size: 3 h; Owner: Ақжан Расуул; Iteration: I 2; Risk: R01.
- Positive: Given өз active session; When Finish басқанда; Then completed сақталады.
- Negative: Given бөтен session; When сұрау орындалғанда; Then 404.

## US-13 — Белсенділік
оқушы ретінде оқу уақытымды көру үшін осы мүмкіндікті қалаймын.

- Epic: progress; Size: 3 h; Owner: Ақжан Расуул; Iteration: I 2; Risk: R17.
- Positive: Given өзім кірдім; When 1..240 минут жібергенде; Then өз белсенділігім жаңарады.
- Negative: Given теріс/шексіз сан; When сұрау орындалғанда; Then 400.

## US-14 — Қауіпсіздік gate
reviewer ретінде деректі қорғау үшін осы мүмкіндікті қалаймын.

- Epic: quality; Size: 8 h; Owner: Исенов Диас; Iteration: I 3; Risk: R03.
- Positive: Given PR дайын; When CI жүргенде; Then secrets/vulnerability және owner тесті тексеріледі.
- Negative: Given HIGH fixable; When сұрау орындалғанда; Then релиз тоқтайды.

## US-15 — Backup restore
оператор ретінде деректі қалпына келтіру үшін осы мүмкіндікті қалаймын.

- Epic: ops; Size: 8 h; Owner: Исенов Диас; Iteration: I 3; Risk: R05.
- Positive: Given тест DB backup бар; When оқшау базаға restore жасағанда; Then row count және sample сәйкес.
- Negative: Given backup бүлінген; When сұрау орындалғанда; Then restore fail, source DB өзгермейді.

## US-16 — UAT
әдіскер ретінде оқушы жолын қабылдау үшін осы мүмкіндікті қалаймын.

- Epic: quality; Size: 8 h; Owner: Исенов Диас; Iteration: I 3; Risk: R09.
- Positive: Given 8 сценарий дайын; When тәуелсіз адам орындағанда; Then нәтиже/дәлел/қолтаңба жазылады.
- Negative: Given P1 ақау; When сұрау орындалғанда; Then қабылдау тоқтайды.

## US-17 — AI benchmark
әдіскер ретінде AI қателігін өлшеу үшін осы мүмкіндікті қалаймын.

- Epic: ai; Size: 8 h; Owner: Ақжан Расуул; Iteration: I 3; Risk: R09.
- Positive: Given 30 synthetic gold reviewed; When үш тәсілді салыстырғанда; Then macro-F1, error және cost есептеледі.
- Negative: Given gold расталмаған; When сұрау орындалғанда; Then production no-go.

## US-18 — PM есеп
PM ретінде апталық күйді көру үшін осы мүмкіндікті қалаймын.

- Epic: management; Size: 8 h; Owner: Азатұлы Есқат; Iteration: I 3; Risk: R15.
- Positive: Given allowlisted snapshot бар; When есеп жасалғанда; Then сандар кодпен, мәтін draft ретінде сақталады.
- Negative: Given дерек жоқ; When сұрау орындалғанда; Then unknown, ойдан сан жоқ.
