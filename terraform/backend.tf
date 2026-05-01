# ============================================================
# Terraform S3 Backend конфигурациясы
# ------------------------------------------------------------
# Қолдану алдында:
#   1. terraform/examples/03-s3-cloudfront/ іске қосып
#      S3 bucket + DynamoDB table жаса
#   2. Нақты атауларды осы жерге толтыр
#   3. terraform init -migrate-state  (жергілікті state-ті S3-ке көшіру)
# ============================================================

# terraform {
#   backend "s3" {
#     bucket         = "ai-english-terraform-state-xxxxxx"  # output-дан алынады
#     key            = "prod/terraform.tfstate"
#     region         = "eu-central-1"
#     encrypt        = true
#     dynamodb_table = "ai-english-terraform-locks"
#   }
# }
