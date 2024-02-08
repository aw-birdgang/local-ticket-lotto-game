resource "aws_db_instance" "lotto_rds" {
  engine                  = "mysql"
  engine_version          = "8.0.33"
  multi_az                = false
  identifier              = "lotto-lanka-${var.environment}"
  username                = "lotto_lanka_admin"
  password                = "sT,S(FK;m5e.T.17"
  db_name                 = "lanka_lotto"
  instance_class          = "db.t4g.micro"
  storage_type            = "gp2"
  allocated_storage       = 20
  max_allocated_storage   = 100
  vpc_security_group_ids  = [aws_security_group.rds.id]
  db_subnet_group_name    = aws_db_subnet_group.private.name
  ca_cert_identifier      = "rds-ca-rsa2048-g1"
  parameter_group_name    = "default.mysql8.0"
  option_group_name       = "default:mysql-8-0"
  backup_retention_period = 7
  skip_final_snapshot     = true
  publicly_accessible     = false
  storage_encrypted       = true
}

resource "aws_db_subnet_group" "private" {
  name       = "private-subnet-group"
  subnet_ids = aws_subnet.private_subnets.*.id

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-rds-private"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}