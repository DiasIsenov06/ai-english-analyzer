output "app_public_ip" {
  description = "Қосымша сервері публичный IP мекенжайы"
  value       = aws_eip.app.public_ip
}

output "app_url" {
  description = "Қосымша URL мекенжайы"
  value       = "https://${var.domain_name}"
}

output "grafana_url" {
  description = "Grafana мониторинг URL"
  value       = "http://${aws_eip.app.public_ip}:3001"
}

output "jenkins_url" {
  description = "Jenkins CI/CD URL"
  value       = "http://${aws_eip.app.public_ip}:8080"
}

output "ssh_command" {
  description = "Серверге SSH арқылы қосылу командасы"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_eip.app.public_ip}"
}

output "vpc_id" {
  description = "VPC идентификаторы"
  value       = aws_vpc.main.id
}
