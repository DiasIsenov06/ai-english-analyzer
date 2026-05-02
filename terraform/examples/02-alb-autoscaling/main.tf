# ============================================================
# ПРИМЕР 2: Application Load Balancer + Auto Scaling Group
# ------------------------------------------------------------
# Продакшн деңгейіндегі архитектура:
#   Internet → ALB (443/80) → Target Group → ASG (2-4 EC2)
#
# Артықшылықтары:
#   - Жоғары қолжетімділік (multi-AZ)
#   - CPU > 70% болса жаңа инстанс қосылады
#   - ALB health check — жаман инстансты автоматты алып тастайды
#   - SSL терминация ALB-де (EC2-де сертификат керек емес)
#
# Қолданылуы:
#   terraform init
#   terraform apply \
#     -var="db_password=Secret123!" \
#     -var="jwt_secret=your-jwt-secret" \
#     -var="ssh_public_key=$(cat ~/.ssh/id_rsa.pub)"
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
      Example   = "02-alb-autoscaling"
      ManagedBy = "Terraform"
    }
  }
}

# ── Айнымалылар ──────────────────────────────────────────────
variable "region"         { default = "eu-central-1" }
variable "db_password"    { sensitive = true }
variable "jwt_secret"     { sensitive = true }
variable "gemini_api_key" { default = ""; sensitive = true }
variable "ssh_public_key" { default = "" }

variable "app_min_size"     { default = 2 }   # Минимум инстанс саны
variable "app_max_size"     { default = 4 }   # Максимум инстанс саны
variable "app_desired_size" { default = 2 }   # Қалаулы инстанс саны
variable "instance_type"    { default = "t3.small" }

# ── Data sources ─────────────────────────────────────────────
data "aws_vpc" "default" { default = true }

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu)
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# ── Security Groups ───────────────────────────────────────────

# ALB SG — интернеттен 80/443 қабылдайды
resource "aws_security_group" "alb" {
  name   = "ai-english-alb-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# App SG — тек ALB-ден трафик қабылдайды
resource "aws_security_group" "app" {
  name   = "ai-english-app-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    description     = "Next.js from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ── SSH Key ───────────────────────────────────────────────────
resource "aws_key_pair" "app" {
  count      = var.ssh_public_key != "" ? 1 : 0
  key_name   = "ai-english-key"
  public_key = var.ssh_public_key
}

# ── Application Load Balancer ─────────────────────────────────
resource "aws_lb" "app" {
  name               = "ai-english-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = data.aws_subnets.default.ids

  enable_deletion_protection = false

  access_logs {
    bucket  = aws_s3_bucket.alb_logs.id
    prefix  = "alb"
    enabled = true
  }
}

# ALB Logs үшін S3 bucket
resource "aws_s3_bucket" "alb_logs" {
  bucket        = "ai-english-alb-logs-${random_id.suffix.hex}"
  force_destroy = true
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::054676820928:root" } # eu-central-1 ELB account
      Action    = "s3:PutObject"
      Resource  = "${aws_s3_bucket.alb_logs.arn}/alb/AWSLogs/*"
    }]
  })
}

# ── Target Group ─────────────────────────────────────────────
resource "aws_lb_target_group" "app" {
  name     = "ai-english-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id

  health_check {
    enabled             = true
    path                = "/api/health"   # Жобадағы health endpoint
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 10
    interval            = 30
    matcher             = "200"
  }
}

# ── ALB Listeners ─────────────────────────────────────────────
# HTTP → HTTPS redirect
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS (ACM сертификат болмаса — self-signed пайдаланылады)
# Нақты доменде aws_acm_certificate ресурсын қос
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.app.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  # certificate_arn = aws_acm_certificate.app.arn  # Нақты домен үшін

  # Demo үшін — self-signed ACM import арқылы
  # Тестте HTTP listener ғана жеткілікті
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  # Уақытша: HTTPS конфигурациясы үшін ACM сертификат керек
  # Сынау кезінде осы блокты comment out жасап, тек HTTP listener қолдан
  lifecycle {
    ignore_changes = [certificate_arn]
  }

  certificate_arn = "arn:aws:acm:eu-central-1:123456789:certificate/placeholder"
}

# ── Launch Template ───────────────────────────────────────────
resource "aws_launch_template" "app" {
  name_prefix   = "ai-english-"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.ssh_public_key != "" ? aws_key_pair.app[0].key_name : null

  vpc_security_group_ids = [aws_security_group.app.id]

  # EC2 инстанс метадата (IMDSv2 — қауіпсізірек)
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"  # IMDSv2
    http_put_response_hop_limit = 1
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -e
    exec > /var/log/user-data.log 2>&1

    # Docker орнату
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker && systemctl start docker

    # Жобаны тарту
    apt-get install -y git
    git clone https://github.com/DiasIsenov06/ai-english-analyzer.git /opt/app
    cd /opt/app

    # .env жасау (RDS endpoint болса - өзгерт)
    cat > .env << 'ENVEOF'
    DATABASE_URL=postgresql://ai_user:${var.db_password}@db:5432/ai_english_analyzer
    JWT_SECRET=${var.jwt_secret}
    GEMINI_API_KEY=${var.gemini_api_key}
    PORT=3000
    ENVEOF

    # App-only docker compose іске қосу (monitoring бөлек сервер)
    docker-compose -f docker-compose.app-only.yml up -d --build
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "ai-english-app" }
  }
}

# ── Auto Scaling Group ────────────────────────────────────────
resource "aws_autoscaling_group" "app" {
  name                = "ai-english-asg"
  vpc_zone_identifier = data.aws_subnets.default.ids
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"  # ALB health check пайдалану
  health_check_grace_period = 120

  min_size         = var.app_min_size
  max_size         = var.app_max_size
  desired_capacity = var.app_desired_size

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
  }

  tag {
    key                 = "Name"
    value               = "ai-english-app"
    propagate_at_launch = true
  }
}

# ── Auto Scaling Policies ─────────────────────────────────────
# CPU > 70% болса — scale out
resource "aws_autoscaling_policy" "scale_out" {
  name                   = "ai-english-scale-out"
  autoscaling_group_name = aws_autoscaling_group.app.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = 1
  cooldown               = 300
}

resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "ai-english-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 70

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.app.name
  }

  alarm_description = "Scale out when CPU > 70%"
  alarm_actions     = [aws_autoscaling_policy.scale_out.arn]
}

# CPU < 30% болса — scale in (инстанс азайту)
resource "aws_autoscaling_policy" "scale_in" {
  name                   = "ai-english-scale-in"
  autoscaling_group_name = aws_autoscaling_group.app.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = -1
  cooldown               = 300
}

resource "aws_cloudwatch_metric_alarm" "cpu_low" {
  alarm_name          = "ai-english-cpu-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 30

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.app.name
  }

  alarm_description = "Scale in when CPU < 30%"
  alarm_actions     = [aws_autoscaling_policy.scale_in.arn]
}

# ── Outputs ───────────────────────────────────────────────────
output "alb_dns_name" {
  description = "ALB DNS атауы — CNAME ретінде домен DNS-ке қос"
  value       = aws_lb.app.dns_name
}

output "app_url" {
  description = "Қосымшаның URL мекенжайы"
  value       = "http://${aws_lb.app.dns_name}"
}

output "target_group_arn" {
  value = aws_lb_target_group.app.arn
}
