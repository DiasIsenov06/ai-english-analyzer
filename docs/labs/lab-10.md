# ЛЗ 10 — CI/CD және DORA

`.github/workflows/ci.yml`: install→lint/typecheck→unit coverage/Python→build; параллель secrets+vulnerability; екеуі өткенде image; main push-та ephemeral staging+smoke. Node 24, lockfile, PostgreSQL 16. Local test DB production-нан бөлек. Бұл workflow файлының болуы remote green run дәлелі емес.

[DORA runner](../../scripts/dora.py), [dashboard](../ops/lab10/dashboard.html), [metrics](../ops/lab10/metrics.json), [тарихи CI](../ops/lab10/ci-evidence.md), [release/rollback](../ops/lab10/release-and-rollback.md). Бұрынғы failed runs 41808839514/41809314797 тарихи күй; қазіргі local result бөлек evidence-де. GitHub-қа осы branch жіберіліп run аяқталмайынша green URL/ұзақтық ойдан жазылмайды.

DORA definitions: deployment frequency = сәтті deploy-staging/4 week; lead=commit→deploycomplete median; CFR=расталған incident-ке байланысты failed deployment/барлық deploy; MTTR=detected→recovered. Staging ephemeral, production reliability емес. API толық оқылмаса unknown, 0 емес; CI quality success deployment емес; incidents журналын адам растауы керек.

Protected main қажеттігі:1 independent review, quality/security/image requiredchecks, stale approvals dismiss, forcepush/deleteoff. Қосылған аккаунт admin=false, сондықтан admin configuration орындалмаған. Repo owner Settings→Rules→main ішінде орнатады; screenshot/APIreadback evidence кейін тіркеледі. Local branch дайын болуы requiredcheck enabled дегенді білдірмейді.

Екі improvement target: (1) тәуелділік security job fail үлесін 2 аптада 0-ге; owner Диас, weekly audit. (2) CI median≤8 min және review waiting≤1 day; owner Расуул, npmcache және кіші PR; baseline run тарихынан жиналады, қазіргі мән unknown.

Release window: жұма 16:00–17:00 Asia/Qyzylorda, driver Диас, reviewer Расуул, scope Есқат. Осы уақытта ешкімге автоматты хабар жіберілмейді. Checklist: backup+isolated restore→CI→schema additive diff→staging UAT→release→journey smoke. Failure: previous image, destructive schema болса compatible backup/newDB арқылы restore; new writes reconciliation жоспарынсыз backup overwrite жоқ. RTO 60 min/RPO 24 h — тек rehearsal растайтын targets. Нөл инцидент жазбасы 100% uptime дәлелі емес.
