# ec2
output "ec2_bastion_endpoint" {
  value       = aws_instance.ec2_bastion.public_dns
  description = "ec2 bastion endpoint"
}

output "ec2_bastion_ip" {
  value       = aws_instance.ec2_bastion.public_ip
  description = "ec2 bastion endpoint"
}

output "ec2_bastion_pem_filename" {
  value     = local_file.ec2_bastion_key.filename
  sensitive = true
}

# rds
output "rds_endpoint" {
  value       = aws_db_instance.lotto_rds.endpoint
  description = "rds endpoint"
}

output "rds_username" {
  value       = aws_db_instance.lotto_rds.username
  description = "admin name"
}

output "rds_user_password" {
  value       = aws_db_instance.lotto_rds.password
  description = "admin password"
  sensitive   = true
}