# ============================================================
# ПРИМЕР 1: AWS RDS PostgreSQL
# ------------------------------------------------------------
# Бұл мысал Docker-дегі PostgreSQL-ді AWS RDS-пен алмастырады.
# Нәтиже: managed DB — автобэкап, failover, патчтар AWS жағынан.
#
# Қолданылуы:
#   cd terraform/examples/01-rds-postgres
#   terraform init
#   terraform apply -var="db_password=MySecret123!"
#
# Содан кейін .env файлында DATABASE_URL-ді жаңарт:
#   DATABASE_URL=postgresql://ai_user:<pass>@<rds_endpoint>:5432/ai_english_analyzer
# ============================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Project   = "ai-english-analyzer"
      Example   = "01-rds-postgres"
      ManagedBy = "Terraform"
    }
  }
}

# ── Айнымалылар ──────────────────────────────────────────────
variable "region"      { default = "eu-central-1" }
variable "db_name"     { default = "ai_english_analyzer" }
variable "db_username" { default = "ai_user" }
variable "db_password" {
  sensitive = true
  description = "RDS PostgreSQL құпия сөзі (min 8 символ)"
}

# ── VPC деректерін алу (бар болса) ───────────────────────────
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ── RDS Security Group ───────────────────────────────────────
# Тек EC2 app серверінен PostgreSQL портына рұқсат
resource "aws_security_group" "rds" {
  name        = "ai-english-rds-sg"
  description = "RDS PostgreSQL access for ai-english app"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "PostgreSQL from app"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    # Нақты продакшнда тек app SG-дан рұқсат беру керек:
    # security_groups = [aws_security_group.app.id]
    cidr_blocks = ["10.0.0.0/8"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ── RDS Subnet Group ─────────────────────────────────────────
# RDS бірнеше availability zone-да болуы үшін
resource "aws_db_subnet_group" "main" {
  name       = "ai-english-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = { Name = "ai-english-db-subnet-group" }
}

# ── RDS Parameter Group ──────────────────────────────────────
# PostgreSQL-ды Prisma үшін баптау
resource "aws_db_parameter_group" "postgres" {
  name   = "ai-english-pg16"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # 1 секундтан ұзақ сұраныстарды логтау
  }
}

# ── RDS Instance ─────────────────────────────────────────────
resource "aws_db_instance" "postgres" {
  identifier = "ai-english-db"

  # Engine
  engine         = "postgres"
  engine_version = "16"   # AWS автоматты соңғы minor version таңдайды (16.x)
  instance_class = "db.t3.micro" # Free tier eligible

  # Storage
  allocated_storage     = 20    # GB
  max_allocated_storage = 100   # Autoscaling максимумы
  storage_type          = "gp3"
  storage_encrypted     = true

  # Credentials
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false # Тек VPC ішінен

  # Availability
  multi_az               = false # true → продакшнда High Availability
  parameter_group_name   = aws_db_parameter_group.postgres.name

  # Backup
  # Free Tier: backup_retention_period тек 0 болуы мүмкін (бэкап өшірулі)
  # Paid account болса: 1-35 аралығына қой
  backup_retention_period   = 0
  # backup_window           = "03:00-04:00"  # retention > 0 болса ашу керек
  maintenance_window        = "sun:04:00-sun:05:00"
  delete_automated_backups  = true

  # Lifecycle
  skip_final_snapshot       = true   # Free Tier-де snapshot да шектелген
  # final_snapshot_identifier = "ai-english-db-final-snapshot"  # paid-да қос
  deletion_protection       = false

  tags = { Name = "ai-english-postgres" }
}

# ── Outputs ──────────────────────────────────────────────────
output "rds_endpoint" {
  description = "RDS connection endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "database_url" {
  description = ".env файлына қою үшін DATABASE_URL"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/${var.db_name}"
  sensitive   = true
}

output "rds_port" {
  value = aws_db_instance.postgres.port
}
