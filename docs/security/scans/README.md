# Сканерлеу — 14.10.2026

Бастапқы commit: `55ab436bc0321ec60f41fa29c0b021c41ead84d0`. Native release binaries қолданылды; ресми SHA256 checksum-дары тексерілді. Docker болмағанда бұл әдістемеде рұқсат етілген.

| Нәтиже | CRITICAL | HIGH | MEDIUM | LOW | Барлығы |
|---|---:|---:|---:|---:|---:|
| Dependency жазбалары | 2 | 42 | 27 | 3 | 74 |
| Misconfiguration | 2 | 10 | 6 | 8 | 26 |

Gitleaks 19 коммитті өңдеді; git rev-list --all 20 reachable commit көрсетті. `--all` екі remote branch-ті қамтыды. 1 candidate — үлгі токен, confirmed live secret: 0. Бұл барлық мүмкін секрет жоқ деген кепілдік емес.

Маңызды runtime жазбалар: Next.js 14.2.35 үшін CVE-2026-75604 және GHSA-2xp9-vwfh-vxw4 (екеуі CRITICAL; alias болуы мүмкін). Scanner ұсынған fix: 15.5.24 немесе 16.3.3. Бұл автоматты upgrade бұйрығы емес: migration/build және нақты пайдаланылатын жолдар тексеріледі.

IaC: негізгі Dockerfile (3), bot Dockerfile (2), негізгі Terraform (7) = 12; RDS example (6) + S3/CloudFront example (8) = 14. SSH openness, IMDSv2 және root user алдымен қаралады. Unrestricted egress CRITICAL бағасы — scanner саясаты, live incident дәлелі емес.

Барлық 100 жазба: [findings.md](findings.md), [trivy-findings.json](trivy-findings.json). Redacted history finding: [gitleaks-redacted.json](gitleaks-redacted.json). Нұсқа, DB уақыты, команда және exit code: [provenance.json](provenance.json).

Шектеу: static filesystem scan; Docker image OS пакеттері, live cloud firewall, runtime authorization және exploitation тексерілген жоқ. Тәуелділіктер runtime/dev ретінде әрі қарай triage қажет. Рұқсатсыз шабуыл жасалған жоқ.
