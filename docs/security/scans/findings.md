# Сканер нәтижелерінің толық журналы

74 dependency және 26 IaC жазбасы. Бұл 100 бөлек шабуыл не 100 бірегей CVE дегенді білдірмейді: бір advisory бірнеше package нұсқасына қайталанады, CVE/GHSA alias болуы мүмкін. Барлық жазба I03/I04 және SEC-02 арқылы бақыланады. Қауіптілік — Trivy бағасы; мысал Terraform файлдары deployment дәлелі емес.

| Жазба | ID | Деңгей | Нысан/пакет | Нұсқа → fix / атау | Күй |
| --- | --- | --- | --- | --- | --- |
| TV-001 | CVE-2026-45819 | MEDIUM | package-lock.json / baseline-browser-mapping | 2.10.0 → 2.11.0 | Open: reachability/upgrade triage қажет |
| TV-002 | CVE-2026-102276 | HIGH | package-lock.json / brace-expansion | 1.1.12 → 5.0.10, 3.0.7, 2.1.5, 1.1.19 | Open: reachability/upgrade triage қажет |
| TV-003 | CVE-2026-102278 | HIGH | package-lock.json / brace-expansion | 1.1.12 → 5.0.11, 3.0.8, 2.1.6, 1.1.20 | Open: reachability/upgrade triage қажет |
| TV-004 | CVE-2026-13149 | HIGH | package-lock.json / brace-expansion | 1.1.12 → 5.0.7, 1.1.16, 2.1.2 | Open: reachability/upgrade triage қажет |
| TV-005 | CVE-2026-14257 | HIGH | package-lock.json / brace-expansion | 1.1.12 → 5.0.8, 3.0.3, 2.1.3, 1.1.17 | Open: reachability/upgrade triage қажет |
| TV-006 | CVE-2026-69152 | HIGH | package-lock.json / brace-expansion | 1.1.12 → 1.1.18, 2.1.4, 3.0.6, 5.0.9 | Open: reachability/upgrade triage қажет |
| TV-007 | CVE-2026-102277 | MEDIUM | package-lock.json / brace-expansion | 1.1.12 → 5.0.12, 3.0.9, 2.1.7, 1.1.21 | Open: reachability/upgrade triage қажет |
| TV-008 | CVE-2026-33750 | MEDIUM | package-lock.json / brace-expansion | 1.1.12 → 5.0.5, 3.0.2, 2.0.3, 1.1.13 | Open: reachability/upgrade triage қажет |
| TV-009 | CVE-2026-102276 | HIGH | package-lock.json / brace-expansion | 2.0.2 → 5.0.10, 3.0.7, 2.1.5, 1.1.19 | Open: reachability/upgrade triage қажет |
| TV-010 | CVE-2026-102278 | HIGH | package-lock.json / brace-expansion | 2.0.2 → 5.0.11, 3.0.8, 2.1.6, 1.1.20 | Open: reachability/upgrade triage қажет |
| TV-011 | CVE-2026-13149 | HIGH | package-lock.json / brace-expansion | 2.0.2 → 5.0.7, 1.1.16, 2.1.2 | Open: reachability/upgrade triage қажет |
| TV-012 | CVE-2026-14257 | HIGH | package-lock.json / brace-expansion | 2.0.2 → 5.0.8, 3.0.3, 2.1.3, 1.1.17 | Open: reachability/upgrade triage қажет |
| TV-013 | CVE-2026-69152 | HIGH | package-lock.json / brace-expansion | 2.0.2 → 1.1.18, 2.1.4, 3.0.6, 5.0.9 | Open: reachability/upgrade triage қажет |
| TV-014 | CVE-2026-102277 | MEDIUM | package-lock.json / brace-expansion | 2.0.2 → 5.0.12, 3.0.9, 2.1.7, 1.1.21 | Open: reachability/upgrade triage қажет |
| TV-015 | CVE-2026-33750 | MEDIUM | package-lock.json / brace-expansion | 2.0.2 → 5.0.5, 3.0.2, 2.0.3, 1.1.13 | Open: reachability/upgrade triage қажет |
| TV-016 | CVE-2026-102276 | HIGH | package-lock.json / brace-expansion | 5.0.4 → 5.0.10, 3.0.7, 2.1.5, 1.1.19 | Open: reachability/upgrade triage қажет |
| TV-017 | CVE-2026-102278 | HIGH | package-lock.json / brace-expansion | 5.0.4 → 5.0.11, 3.0.8, 2.1.6, 1.1.20 | Open: reachability/upgrade triage қажет |
| TV-018 | CVE-2026-13149 | HIGH | package-lock.json / brace-expansion | 5.0.4 → 5.0.7, 1.1.16, 2.1.2 | Open: reachability/upgrade triage қажет |
| TV-019 | CVE-2026-14257 | HIGH | package-lock.json / brace-expansion | 5.0.4 → 5.0.8, 3.0.3, 2.1.3, 1.1.17 | Open: reachability/upgrade triage қажет |
| TV-020 | CVE-2026-69152 | HIGH | package-lock.json / brace-expansion | 5.0.4 → 1.1.18, 2.1.4, 3.0.6, 5.0.9 | Open: reachability/upgrade triage қажет |
| TV-021 | CVE-2026-102277 | MEDIUM | package-lock.json / brace-expansion | 5.0.4 → 5.0.12, 3.0.9, 2.1.7, 1.1.21 | Open: reachability/upgrade triage қажет |
| TV-022 | CVE-2026-33750 | MEDIUM | package-lock.json / brace-expansion | 5.0.4 → 5.0.5, 3.0.2, 2.0.3, 1.1.13 | Open: reachability/upgrade triage қажет |
| TV-023 | CVE-2026-45149 | MEDIUM | package-lock.json / brace-expansion | 5.0.4 → 5.0.6 | Open: reachability/upgrade triage қажет |
| TV-024 | CVE-2026-93687 | HIGH | package-lock.json / braces | 3.0.3 →  | Open: reachability/upgrade triage қажет |
| TV-025 | CVE-2026-73088 | HIGH | package-lock.json / browserslist | 4.28.1 → 4.28.7 | Open: reachability/upgrade triage қажет |
| TV-026 | CVE-2026-73089 | HIGH | package-lock.json / browserslist | 4.28.1 → 4.28.7 | Open: reachability/upgrade triage қажет |
| TV-027 | CVE-2026-32141 | HIGH | package-lock.json / flatted | 3.3.4 → 3.4.0 | Open: reachability/upgrade triage қажет |
| TV-028 | CVE-2026-33228 | HIGH | package-lock.json / flatted | 3.3.4 → 3.4.2 | Open: reachability/upgrade triage қажет |
| TV-029 | CVE-2025-64756 | HIGH | package-lock.json / glob | 10.3.10 → 11.1.0, 10.5.0 | Open: reachability/upgrade triage қажет |
| TV-030 | CVE-2026-59869 | HIGH | package-lock.json / js-yaml | 4.1.1 → 3.15.0, 4.3.0 | Open: reachability/upgrade triage қажет |
| TV-031 | CVE-2026-84375 | HIGH | package-lock.json / js-yaml | 4.1.1 → 4.3.2, 3.15.2 | Open: reachability/upgrade triage қажет |
| TV-032 | GHSA-5p4m-2wfm-xmqj | HIGH | package-lock.json / js-yaml | 4.1.1 → 4.3.1, 3.15.1 | Open: reachability/upgrade triage қажет |
| TV-033 | CVE-2026-53550 | MEDIUM | package-lock.json / js-yaml | 4.1.1 → 4.2.0, 3.15.0 | Open: reachability/upgrade triage қажет |
| TV-034 | CVE-2026-67213 | HIGH | package-lock.json / nanoid | 3.3.11 → 3.3.18, 5.1.6 | Open: reachability/upgrade triage қажет |
| TV-035 | CVE-2026-67214 | HIGH | package-lock.json / nanoid | 3.3.11 → 3.3.16, 5.1.16 | Open: reachability/upgrade triage қажет |
| TV-036 | CVE-2026-73086 | HIGH | package-lock.json / nanoid | 3.3.11 → 3.3.12, 5.1.11 | Open: reachability/upgrade triage қажет |
| TV-037 | CVE-2026-75604 | CRITICAL | package-lock.json / next | 14.2.35 → 15.5.24, 16.3.3 | Open: reachability/upgrade triage қажет |
| TV-038 | GHSA-2xp9-vwfh-vxw4 | CRITICAL | package-lock.json / next | 14.2.35 → 15.5.24, 16.3.3 | Open: reachability/upgrade triage қажет |
| TV-039 | CVE-2026-44573 | HIGH | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-040 | CVE-2026-44578 | HIGH | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-041 | CVE-2026-64641 | HIGH | package-lock.json / next | 14.2.35 → 15.5.21, 16.2.11 | Open: reachability/upgrade triage қажет |
| TV-042 | CVE-2026-64645 | HIGH | package-lock.json / next | 14.2.35 → 15.5.21, 16.2.11 | Open: reachability/upgrade triage қажет |
| TV-043 | CVE-2026-64649 | HIGH | package-lock.json / next | 14.2.35 → 15.5.21, 16.2.11 | Open: reachability/upgrade triage қажет |
| TV-044 | GHSA-8h8q-6873-q5fj | HIGH | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-045 | GHSA-h25m-26qc-wcjf | HIGH | package-lock.json / next | 14.2.35 → 15.0.8, 15.1.12, 15.2.9, 15.3.9, 15.4.11, 15.5.10, 15.6.0-canary.61, 16.0.11, 16.1.5 | Open: reachability/upgrade triage қажет |
| TV-046 | GHSA-q4gf-8mx6-v5v3 | HIGH | package-lock.json / next | 14.2.35 → 15.5.15, 16.2.3 | Open: reachability/upgrade triage қажет |
| TV-047 | CVE-2025-59471 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.10, 16.1.5 | Open: reachability/upgrade triage қажет |
| TV-048 | CVE-2026-27980 | MEDIUM | package-lock.json / next | 14.2.35 → 16.1.7, 15.5.14 | Open: reachability/upgrade triage қажет |
| TV-049 | CVE-2026-29057 | MEDIUM | package-lock.json / next | 14.2.35 → 16.1.7, 15.5.13 | Open: reachability/upgrade triage қажет |
| TV-050 | CVE-2026-44576 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-051 | CVE-2026-44577 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-052 | CVE-2026-44580 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-053 | CVE-2026-44581 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-054 | CVE-2026-64643 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.21, 16.2.11 | Open: reachability/upgrade triage қажет |
| TV-055 | CVE-2026-64646 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.21, 16.2.11 | Open: reachability/upgrade triage қажет |
| TV-056 | CVE-2026-64647 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.21, 16.2.11 | Open: reachability/upgrade triage қажет |
| TV-057 | CVE-2026-64648 | MEDIUM | package-lock.json / next | 14.2.35 → 15.5.21, 16.2.11 | Open: reachability/upgrade triage қажет |
| TV-058 | CVE-2026-44572 | LOW | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-059 | CVE-2026-44582 | LOW | package-lock.json / next | 14.2.35 → 15.5.16, 16.2.5 | Open: reachability/upgrade triage қажет |
| TV-060 | CVE-2026-33671 | HIGH | package-lock.json / picomatch | 2.3.1 → 4.0.4, 3.0.2, 2.3.2 | Open: reachability/upgrade triage қажет |
| TV-061 | CVE-2026-33672 | MEDIUM | package-lock.json / picomatch | 2.3.1 → 4.0.4, 3.0.2, 2.3.2 | Open: reachability/upgrade triage қажет |
| TV-062 | CVE-2026-33671 | HIGH | package-lock.json / picomatch | 4.0.3 → 4.0.4, 3.0.2, 2.3.2 | Open: reachability/upgrade triage қажет |
| TV-063 | CVE-2026-33672 | MEDIUM | package-lock.json / picomatch | 4.0.3 → 4.0.4, 3.0.2, 2.3.2 | Open: reachability/upgrade triage қажет |
| TV-064 | CVE-2026-45623 | HIGH | package-lock.json / postcss | 8.4.31 → 8.5.12 | Open: reachability/upgrade triage қажет |
| TV-065 | CVE-2026-73646 | HIGH | package-lock.json / postcss | 8.4.31 → 8.5.18 | Open: reachability/upgrade triage қажет |
| TV-066 | CVE-2026-41305 | MEDIUM | package-lock.json / postcss | 8.4.31 → 8.5.10 | Open: reachability/upgrade triage қажет |
| TV-067 | CVE-2026-69153 | MEDIUM | package-lock.json / postcss | 8.4.31 → 8.5.23 | Open: reachability/upgrade triage қажет |
| TV-068 | CVE-2026-45623 | HIGH | package-lock.json / postcss | 8.5.8 → 8.5.12 | Open: reachability/upgrade triage қажет |
| TV-069 | CVE-2026-73646 | HIGH | package-lock.json / postcss | 8.5.8 → 8.5.18 | Open: reachability/upgrade triage қажет |
| TV-070 | CVE-2026-41305 | MEDIUM | package-lock.json / postcss | 8.5.8 → 8.5.10 | Open: reachability/upgrade triage қажет |
| TV-071 | CVE-2026-69153 | MEDIUM | package-lock.json / postcss | 8.5.8 → 8.5.23 | Open: reachability/upgrade triage қажет |
| TV-072 | CVE-2026-104844 | MEDIUM | package-lock.json / postcss-selector-parser | 6.1.2 → 7.1.6 | Open: reachability/upgrade triage қажет |
| TV-073 | CVE-2026-9358 | LOW | package-lock.json / postcss-selector-parser | 6.1.2 → 6.1.3, 7.1.3 | Open: reachability/upgrade triage қажет |
| TV-074 | CVE-2026-93749 | HIGH | package-lock.json / source-map-js | 1.2.1 → 1.2.2 | Open: reachability/upgrade triage қажет |
| TV-075 | DS-0002 | HIGH | Dockerfile /  | Image user should not be 'root' | Open: deployment context triage қажет |
| TV-076 | DS-0026 | LOW | Dockerfile /  | No HEALTHCHECK defined | Open: deployment context triage қажет |
| TV-077 | DS-0029 | HIGH | Dockerfile /  | 'apt-get' missing '--no-install-recommends' | Open: deployment context triage қажет |
| TV-078 | DS-0002 | HIGH | monitoring/telegram-bot/Dockerfile /  | Image user should not be 'root' | Open: deployment context triage қажет |
| TV-079 | DS-0026 | LOW | monitoring/telegram-bot/Dockerfile /  | No HEALTHCHECK defined | Open: deployment context triage қажет |
| TV-080 | AWS-0077 | MEDIUM | terraform/examples/01-rds-postgres/main.tf /  | RDS Cluster and RDS instance should have backup retention longer than default 1 day | Open: deployment context triage қажет |
| TV-081 | AWS-0104 | CRITICAL | terraform/examples/01-rds-postgres/main.tf /  | A security group rule should not allow unrestricted egress to any IP address. | Open: deployment context triage қажет |
| TV-082 | AWS-0124 | LOW | terraform/examples/01-rds-postgres/main.tf /  | Missing description for security group rule. | Open: deployment context triage қажет |
| TV-083 | AWS-0133 | LOW | terraform/examples/01-rds-postgres/main.tf /  | Enable Performance Insights to detect potential problems | Open: deployment context triage қажет |
| TV-084 | AWS-0176 | MEDIUM | terraform/examples/01-rds-postgres/main.tf /  | RDS IAM Database Authentication Disabled | Open: deployment context triage қажет |
| TV-085 | AWS-0177 | MEDIUM | terraform/examples/01-rds-postgres/main.tf /  | RDS Deletion Protection Disabled | Open: deployment context triage қажет |
| TV-086 | AWS-0010 | MEDIUM | terraform/examples/03-s3-cloudfront/main.tf /  | Cloudfront distribution should have Access Logging configured | Open: deployment context triage қажет |
| TV-087 | AWS-0011 | HIGH | terraform/examples/03-s3-cloudfront/main.tf /  | CloudFront distribution does not have a WAF in front. | Open: deployment context triage қажет |
| TV-088 | AWS-0024 | MEDIUM | terraform/examples/03-s3-cloudfront/main.tf /  | Point in time recovery should be enabled to protect DynamoDB table | Open: deployment context triage қажет |
| TV-089 | AWS-0025 | LOW | terraform/examples/03-s3-cloudfront/main.tf /  | DynamoDB tables should use at rest encryption with a Customer Managed Key | Open: deployment context triage қажет |
| TV-090 | AWS-0089 | LOW | terraform/examples/03-s3-cloudfront/main.tf /  | S3 Bucket Logging | Open: deployment context triage қажет |
| TV-091 | AWS-0089 | LOW | terraform/examples/03-s3-cloudfront/main.tf /  | S3 Bucket Logging | Open: deployment context triage қажет |
| TV-092 | AWS-0132 | HIGH | terraform/examples/03-s3-cloudfront/main.tf /  | S3 encryption should use Customer Managed Keys | Open: deployment context triage қажет |
| TV-093 | AWS-0132 | HIGH | terraform/examples/03-s3-cloudfront/main.tf /  | S3 encryption should use Customer Managed Keys | Open: deployment context triage қажет |
| TV-094 | AWS-0028 | HIGH | terraform/main.tf /  | aws_instance should activate session tokens for Instance Metadata Service. | Open: deployment context triage қажет |
| TV-095 | AWS-0104 | CRITICAL | terraform/main.tf /  | A security group rule should not allow unrestricted egress to any IP address. | Open: deployment context triage қажет |
| TV-096 | AWS-0107 | HIGH | terraform/main.tf /  | Security groups should not allow unrestricted ingress to SSH or RDP from any IP address. | Open: deployment context triage қажет |
| TV-097 | AWS-0124 | LOW | terraform/main.tf /  | Missing description for security group rule. | Open: deployment context triage қажет |
| TV-098 | AWS-0164 | HIGH | terraform/main.tf /  | Instances in a subnet should not receive a public IP address by default. | Open: deployment context triage қажет |
| TV-099 | AWS-0164 | HIGH | terraform/main.tf /  | Instances in a subnet should not receive a public IP address by default. | Open: deployment context triage қажет |
| TV-100 | AWS-0178 | MEDIUM | terraform/main.tf /  | VPC Flow Logs is a feature that enables you to capture information about the IP traffic going to and from network interfaces in your VPC. After you've created a flow log, you can view and retrieve its data in Amazon CloudWatch Logs. It is recommended that VPC Flow Logs be enabled for packet "Rejects" for VPCs. | Open: deployment context triage қажет |

## Gitleaks

I05: `.env.example:19`, commit `9f169fdde689af7c925782f2c564b6bf8620ab68`, rule `telegram-bot-api-token`. Үлгілік қайталанатын таңбалар; нақты secret расталмады. Ескі history нәтижесі өшірілмейді, allowlist қосылмайды. Шынайы secret кейін расталса алдымен provider-де revoke/rotate, кейін орта secret-ін ауыстыру, журналды тексеру және қайта scan; файлды жоюдың өзі жеткіліксіз.
