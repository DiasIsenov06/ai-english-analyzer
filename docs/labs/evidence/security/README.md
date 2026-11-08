# Security scan, 08.11.2026

Trivy0.76.2: HIGH/CRITICAL dependency findings: 0, infrastructure misconfigurations: 15. Full raw report and provenance are adjacent. Configuration findings map to R12, owner Исенов Диас, due before cloud deployment. No cloud resources were created.

Gitleaks scans current source and 28 commits:0 after exact historical illustrative placeholder fingerprint exclusion in `.gitleaksignore`. Original finding is preserved under docs/security/scans; no wildcard rule or secret detector was disabled.

Fixed: JWT owner checks, missing secret rejection, Next/PostCSS patches, non-root application and bot images, SSH defaultclosed and IMDSv2. Remaining: Terraform examples need egress restriction, encryption/access logging/WAF and administrator network selection. Production gate remains closed.
