# STRIDE моделі

[Threat Dragon v2 JSON](threat-model.json) ресми JSON Schema бойынша тексеріледі. [SVG схема](threat-model.svg) осы дерек ағынын көрсетеді. Модельдегі `isEncrypted=false` параметрі шифрлау жоқ екеніне production дәлелі емес: browser/API және DB TLS-і код талдауында расталмады.

## S01 — Spoofing

**Қауіп:** JWT fallback арқылы жалған сессия. JWT_SECRET жоқ ортада auth.ts болжамды fallback қолданады. Құпия кілттің тірі ортада қолданылғаны белгісіз.

**Мера:** Fallback жою; startup validation; нақты қолданылған кілтті айналдыру; auth negative tests.

**Статус:** Open; RAID R02; backlog SEC-01.

## T01 — Tampering

**Қауіп:** Бөгде жоспар күнін өзгерту. PATCH plan/day body.dayId бойынша жаңартады; JWT мен дерек иесі тексерілмейді.

**Мера:** userId token-нен; owner шарты бар query; status enum және транзакция; екі пайдаланушының теріс тесті.

**Статус:** Open; RAID R01; backlog SEC-01.

## R01 — Repudiation

**Қауіп:** Әрекеттің авторын дәлелдеу мүмкін емес. Арнайы access/consent audit моделі көрінбейді; console.error толық аудиттің орнына жүрмейді.

**Мера:** Уақыт, actor pseudonym, action, resource ID, result, correlation ID; өзгертілмейтін сақтау; token/prompt-сыз журнал.

**Статус:** Open; RAID R15; backlog SEC-03.

## I01 — Information disclosure

**Қауіп:** Жоспардың ашылуы және LLM-ге артық мәтін беру. GET plan/current query.userId-ге сенеді. Training API сыртқы провайдерге соңғы 6 хабарлама мен ағымдағы мәтінді жібереді.

**Мера:** Owner guard; prompt минимизациясы; consent/беру негізі; ҚР сақтау дәлелі; backup шифрлау.

**Статус:** Open; RAID R01, R04; backlog SEC-01 / SEC-03.

## D01 — Denial of service

**Қауіп:** Шектеусіз AI сұрауы ресурсты ұстайды. Training message route-та timeout, per-user rate limit және message max length анықталмады.

**Мера:** Ұзындық шегі, per-user лимит, Abort timeout, квота және retry budget; жүктеме тесті.

**Статус:** Open; RAID R08, R19; backlog SEC-03.

## E01 — Elevation of privilege

**Қауіп:** Басқа қолданушының дерегін басқару. Plan және study-activity маршруттары клиент жіберген userId-ді өкілеттік ретінде қабылдайды. Docker процестерінде root default бар.

**Мера:** Object-level authorization және least privilege; контейнерге non-root USER; DB құқығын шектеу.

**Статус:** Open; RAID R01, R12; backlog SEC-01 / SEC-02.

## Нақты бар қорғаныс

Пароль bcrypt cost=12 арқылы хэштеледі. Training message route JWT-ді және session.userId-ді тексереді. Бұл бақылау plan/study-activity маршруттарына автоматты таралмайды. Prisma query қолданылуы бүкіл жобаға толық қауіпсіздік кепілдігін бермейді.

## Шекаралар

TB1: сенімсіз браузер → сервер. TB2: app → DB service account. TB3: сервер → бөлек ұйымның AI сервисі. F1-де input пен token, F2-де профиль/жоспар/чат, F3-де соңғы алты хабарлама және ағымдағы мәтін бар. Провайдерге email/password арнайы жіберілмейді, бірақ пайдаланушы мәтінге өз дерегін енгізуі мүмкін.
