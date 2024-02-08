# RSA key of size 4096 bits
resource "tls_private_key" "rsa" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ec2_bastion" {
  key_name   = "ec2-bastion.pem"
  public_key = tls_private_key.rsa.public_key_openssh
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-key-pair-bastion"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}

resource "local_file" "ec2_bastion_key" {
  filename = "ec2-bastion.pem"
  content  = tls_private_key.rsa.private_key_pem
}

resource "aws_instance" "ec2_bastion" {
  ami                    = "ami-02453f5468b897e31" # Amazon Linux 2023 AMI
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.ec2_bastion.key_name
  subnet_id              = aws_subnet.public_subnets[random_integer.random_subnet_index.result].id
  vpc_security_group_ids = [aws_security_group.ec2_bastion.id]

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-ec2-bastion"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}
