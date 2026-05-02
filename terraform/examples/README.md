# Terraform Examples — AI English Analyzer

Үш мысал, күрделілік бойынша сұрыпталған:

---

## 01 — RDS PostgreSQL

Docker-дегі PostgreSQL-ді AWS-тің managed RDS-ке ауыстырады.

**Не береді:** автобэкап, failover, патчтар AWS жағынан.

```bash
cd terraform/examples/01-rds-postgres
terraform init
terraform apply -var="db_password=MySecret123!"

# Output-тан DATABASE_URL-ді алып .env-ге қой:
terraform output -raw database_url
```

---

## 02 — ALB + Auto Scaling Group

Internet → ALB → Target Group → 2-4 EC2 инстанс.

**Не береді:** жоғары қолжетімділік, CPU-ға қарай autoscaling.

```bash
cd terraform/examples/02-alb-autoscaling
terraform init
terraform apply \
  -var="db_password=Secret123!" \
  -var="jwt_secret=my-jwt-secret" \
  -var="ssh_public_key=$(cat ~/.ssh/id_rsa.pub)"

# ALB URL:
terraform output alb_dns_name
```

---

## 03 — S3 + CloudFront + Terraform Backend

S3-те статика + CloudFront CDN + команда үшін S3 State Backend.

**Не береді:** CDN арқылы жылдам жеткізу + команда бірге Terraform жасай алады.

```bash
cd terraform/examples/03-s3-cloudfront
terraform init
terraform apply

# Deploy:
npm run build
$(terraform output -raw s3_deploy_command)
$(terraform output -raw cloudfront_invalidation_command)
```

---

## Толық продакшн стек (барлығы бірге)

```
terraform/main.tf          → EC2 + Nginx (негізгі)
examples/01-rds-postgres/  → RDS DB (main.tf-тегі Docker DB орнына)
examples/02-alb-autoscaling/ → ALB + ASG (масштабтау керек болса)
examples/03-s3-cloudfront/ → CDN + State backend
```
