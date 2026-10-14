# ЛЗ7: тәуекел, STRIDE және сәйкестік

AI English Analyzer; 14.10.2026; Ақжан Расуул. Талдау baseline: `55ab436bc0321ec60f41fa29c0b021c41ead84d0`.

- [Жеке pre-mortem](pre-mortem.md)
- [RAID: 20 тәуекел, 5 допущение, 10 issue, 3 dependency](raid.md)
- [Топ-5 жауап жоспары](response-plans.md)
- [EMV: 38.40 сағат; ЛЗ5-пен салыстыру](risk-reserve.md)
- [STRIDE: 6 санат](stride.md), [Threat Dragon JSON](threat-model.json), [SVG схема](threat-model.svg)
- [Trivy/Gitleaks нәтижелері және толық журнал](scans/README.md)
- [Дербес деректер және AI чек-листі](compliance.md)
- [Үш GitHub issue көрсетілген тақта](board.md)
- [Қайта сканерлеу скрипті](../../scripts/security-scan.sh)

## Нәтиже және шектеу

Артефакттар мен нақты scanner нәтижелері дайын; барлық тәуекелді азайту жұмысы аяқталды деген белгі қойылған жоқ. Trivy 74 dependency және 26 misconfiguration жазбасын берді. History Gitleaks-та 1 үлгі token candidate бар; тірі secret расталмады. `.env.example` үлгі токені босатылды; жұмыс ағашын қайта сканерлеу 0 finding берді. Тарих қайта жазылмады.

Threat Dragon файлы ресми v2 JSON Schema бойынша валидтелді. Модельдегі барлық 6 қауіп Open. Browser UI import нәтижесі тіркелген жоқ. Толық live deployment, intrusion test және cloud audit жасалған жоқ.

Университеттің ішкі саясатын және пилот келісімін тіркеу — D02/SEC-03 ашық шарты. Командалық pre-mortem отырысы ретінде жеке талдауды көрсетуге болмайды. Спонсордың 6 сағат басқарушылық резервке мақұлдауы алынған жоқ. GitHub Projects орнына репозиторийдегі issue сілтемелері бар тақта берілді; қажет Projects view қосылуы тиіс.

## Қайталану

Толық clone және барлық қажет refs алынған ортада Trivy/Gitleaks орнатып, `bash scripts/security-scan.sh` орындаңыз. Бұл скрипт findings болса nonzero қайтарады. Ескі үлгілік history candidate сақталғандықтан Gitleaks history 1 қайтара алады; allowlist автоматты қосылмайды.
