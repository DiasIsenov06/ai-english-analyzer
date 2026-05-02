# ============================================================
# ПРИМЕР 3: S3 + CloudFront CDN + Terraform S3 Backend
# ------------------------------------------------------------
# Не жасайды:
#   1. S3 bucket — Next.js статикалық export файлдарын сақтайды
#   2. CloudFront — CDN арқылы барлық әлемге жылдам жеткізеді
#   3. S3 Backend — Terraform state-ті S3+DynamoDB-де сақтайды
#      (команда мүшелері бір state-ті ортақ пайдалана алады)
#
# Next.js конфигурациясы (next.config.js):
#   output: 'export'  ← статикалық HTML/CSS/JS генерациялайды
#   basePath: ''
#
# Build + Deploy:
#   npm run build     → out/ каталогы жасалады
#   aws s3 sync out/ s3://ai-english-static-xxx/ --delete
#   aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
#
# Қолданылуы:
#   terraform init
#   terraform apply
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  # ── S3 Backend (команда бірлесіп жұмыс жасайды) ──────────
  # Алдымен backend S3 bucket жасауды comment-out жасап іске қос,
  # содан кейін осы блокты қосып қайта init жаса
  #
  # backend "s3" {
  #   bucket         = "ai-english-terraform-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "eu-central-1"
  #   encrypt        = true
  #   dynamodb_table = "ai-english-terraform-locks"
  # }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# CloudFront — тек us-east-1 провайдері арқылы жұмыс жасайды
provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Project   = "ai-english-analyzer"
      Example   = "03-s3-cloudfront"
      ManagedBy = "Terraform"
    }
  }
}

variable "region" { default = "eu-central-1" }

resource "random_id" "bucket_suffix" {
  byte_length = 6
}

# ============================================================
# БӨЛІМ 1: Terraform State Backend
# ============================================================

# Terraform state сақтайтын S3 bucket
resource "aws_s3_bucket" "terraform_state" {
  bucket        = "ai-english-terraform-state-${random_id.bucket_suffix.hex}"
  force_destroy = false # State файлын кездейсоқ өшіруден қорғайды

  tags = { Purpose = "terraform-state" }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled" # State-тің барлық нұсқасын сақтайды
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# DynamoDB — concurrent apply-дан қорғау (state lock)
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "ai-english-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = { Purpose = "terraform-state-lock" }
}

# ============================================================
# БӨЛІМ 2: Next.js Static Files → S3
# ============================================================

# Статикалық файлдар сақталатын S3 bucket
resource "aws_s3_bucket" "static_site" {
  bucket        = "ai-english-static-${random_id.bucket_suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "static_site" {
  bucket = aws_s3_bucket.static_site.id
  versioning_configuration { status = "Enabled" }
}

# CloudFront OAC арқылы ғана S3-ке қатынас (тікелей URL жабық)
resource "aws_s3_bucket_public_access_block" "static_site" {
  bucket                  = aws_s3_bucket.static_site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ── CloudFront Origin Access Control ─────────────────────────
resource "aws_cloudfront_origin_access_control" "main" {
  provider                          = aws.virginia
  name                              = "ai-english-oac"
  description                       = "OAC for ai-english static site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ── CloudFront Distribution ───────────────────────────────────
resource "aws_cloudfront_distribution" "main" {
  provider = aws.virginia
  enabled  = true
  comment  = "AI English Analyzer CDN"

  default_root_object = "index.html"

  # Қай аймақтарда кэш болады (price_class_all = бүкіл әлем)
  price_class = "PriceClass_100" # Тек Еуропа + Солтүстік Америка (арзанырақ)

  origin {
    domain_name              = aws_s3_bucket.static_site.bucket_regional_domain_name
    origin_id                = "s3-static"
    origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  }

  # API сұраныстарын EC2/ALB-ге жіберу (Next.js API routes)
  # origin {
  #   domain_name = "your-alb-dns.eu-central-1.elb.amazonaws.com"
  #   origin_id   = "alb-api"
  #   custom_origin_config {
  #     http_port              = 80
  #     https_port             = 443
  #     origin_protocol_policy = "https-only"
  #     origin_ssl_protocols   = ["TLSv1.2"]
  #   }
  # }

  default_cache_behavior {
    target_origin_id       = "s3-static"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    cache_policy_id = aws_cloudfront_cache_policy.static.id

    # Security headers
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # API маршруттары — кэшсіз, EC2-ге pass-through
  # ordered_cache_behavior {
  #   path_pattern           = "/api/*"
  #   target_origin_id       = "alb-api"
  #   viewer_protocol_policy = "https-only"
  #   allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
  #   cached_methods         = ["GET", "HEAD"]
  #   cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled managed policy
  # }

  # SPA routing — 404-ті index.html-ге redirect (Next.js үшін)
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # Нақты домен үшін:
    # acm_certificate_arn      = aws_acm_certificate.app.arn
    # ssl_support_method       = "sni-only"
    # minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = { Name = "ai-english-cdn" }
}

# ── Cache Policy ──────────────────────────────────────────────
resource "aws_cloudfront_cache_policy" "static" {
  provider    = aws.virginia
  name        = "ai-english-static-cache"
  min_ttl     = 0
  default_ttl = 86400    # 1 күн
  max_ttl     = 31536000 # 1 жыл

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config  { cookie_behavior  = "none" }
    headers_config  { header_behavior  = "none" }
    query_strings_config { query_string_behavior = "none" }
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}

# ── Security Headers Policy ───────────────────────────────────
resource "aws_cloudfront_response_headers_policy" "security" {
  provider = aws.virginia
  name     = "ai-english-security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
  }
}

# ── S3 Bucket Policy (тек CloudFront OAC рұқсат) ─────────────
resource "aws_s3_bucket_policy" "static_site" {
  bucket = aws_s3_bucket.static_site.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowCloudFrontOAC"
      Effect = "Allow"
      Principal = {
        Service = "cloudfront.amazonaws.com"
      }
      Action   = "s3:GetObject"
      Resource = "${aws_s3_bucket.static_site.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
        }
      }
    }]
  })
}

# ============================================================
# БӨЛІМ 3: Deploy скрипті (local-exec)
# ============================================================
# Build + S3 sync + CloudFront invalidation
resource "null_resource" "deploy_static" {
  # next.config.js-де output: 'export' болса ғана іске қосады
  triggers = {
    distribution_id = aws_cloudfront_distribution.main.id
  }

  # Жергілікті машинада орындалады
  # provisioner "local-exec" {
  #   command = <<-CMD
  #     cd ${path.root}/../../..
  #     npm run build
  #     aws s3 sync out/ s3://${aws_s3_bucket.static_site.id}/ --delete
  #     aws cloudfront create-invalidation \
  #       --distribution-id ${aws_cloudfront_distribution.main.id} \
  #       --paths "/*"
  #   CMD
  # }

  depends_on = [aws_cloudfront_distribution.main]
}

# ── Outputs ───────────────────────────────────────────────────
output "cloudfront_url" {
  description = "CloudFront CDN URL"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "s3_static_bucket" {
  description = "Статикалық файлдар bucket"
  value       = aws_s3_bucket.static_site.id
}

output "s3_deploy_command" {
  description = "Файлдарды S3-ке жіберу командасы"
  value       = "aws s3 sync out/ s3://${aws_s3_bucket.static_site.id}/ --delete"
}

output "cloudfront_invalidation_command" {
  description = "CloudFront кэшін тазалау командасы"
  value       = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.main.id} --paths '/*'"
}

output "terraform_state_bucket" {
  description = "Terraform state S3 bucket атауы"
  value       = aws_s3_bucket.terraform_state.id
}

output "terraform_backend_config" {
  description = "Backend конфигурациясын осы мәндерге сай жаңарт"
  value = <<-EOT
    terraform {
      backend "s3" {
        bucket         = "${aws_s3_bucket.terraform_state.id}"
        key            = "prod/terraform.tfstate"
        region         = "${var.region}"
        encrypt        = true
        dynamodb_table = "${aws_dynamodb_table.terraform_locks.name}"
      }
    }
  EOT
}
