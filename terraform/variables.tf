# ============================================
# AI English Analyzer — Terraform айнымалылары
# ============================================

variable "project_name" {
  description = "Жоба атауы (барлық ресурстарда қолданылады)"
  type        = string
  default     = "ai-english-analyzer"
}

variable "environment" {
  description = "Орта: dev, staging, prod"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Орта тек dev, staging немесе prod болуы мүмкін."
  }
}

variable "region" {
  description = "AWS аймағы (немесе бұлт провайдер аймағы)"
  type        = string
  default     = "eu-central-1"
}

variable "app_instance_type" {
  description = "EC2 / VM инстанс түрі"
  type        = string
  default     = "t3.small"
}

variable "db_instance_type" {
  description = "Дерекқор инстанс түрі"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "PostgreSQL дерекқор атауы"
  type        = string
  default     = "ai_english_analyzer"
}

variable "db_username" {
  description = "PostgreSQL пайдаланушы атауы"
  type        = string
  default     = "ai_user"
}

variable "db_password" {
  description = "PostgreSQL құпия сөзі"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT токен кілті"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API кілті"
  type        = string
  sensitive   = true
  default     = ""
}

variable "domain_name" {
  description = "Домен атауы (SSL үшін)"
  type        = string
  default     = "aienglish.example.com"
}

variable "ssh_public_key" {
  description = "SSH public кілт (серверге кіру үшін)"
  type        = string
  default     = ""
}

variable "allowed_ssh_cidr" {
  description = "SSH кіруге рұқсат етілген IP блоктары"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
