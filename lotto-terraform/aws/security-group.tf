# all security groups
# fixme these are have to separate by service
# 모든 security group 는 각각의 서비스로 이동 해서 사용되도록 함.

resource "aws_security_group" "ec2_bastion" {
  name        = "lotto ec2 bastion"
  description = "lotto ec2 bastion"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description = "Dosan-daero 5f GPEX wifi 5g"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["61.78.96.20/32"]
  }

  ingress {
    description = "Dosan-daero 5f GPEX wifi 5g"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["61.78.96.20/32"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-ec2-bastion"
    }
  )
}

resource "aws_security_group" "web_services_alb" {
  name        = "lotto web service application load balancer"
  description = "lotto web service application load balancer"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description      = "HTTP"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "HTTPS"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-web-service-alb"
    }
  )
}

resource "aws_security_group" "ecs_web_services" {
  name        = "lotto ecs web service"
  description = "lotto ecs web service"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description     = "web service alb sg"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.web_services_alb.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-ecs-web-service"
    }
  )
}

resource "aws_security_group" "backend_services_alb" {
  name        = "lotto backend service alb"
  description = "lotto backend service alb"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description      = "HTTP"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "HTTPS"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-backend-services-alb"
    }
  )
}

resource "aws_security_group" "ecs_backend_services" {
  name        = "lotto ecs backend service"
  description = "lotto ecs backend service"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description     = "seller api"
    from_port       = 3500
    to_port         = 3500
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_services_alb.id]
  }

  ingress {
    description     = "player api"
    from_port       = 3200
    to_port         = 3200
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_services_alb.id]
  }

  ingress {
    description     = "admin api"
    from_port       = 3100
    to_port         = 3100
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_services_alb.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-ecs-backend-service"
    }
  )
}

resource "aws_security_group" "ecs_batch_service" {
  name        = "lotto ecs batch server"
  description = "lotto ecs batch server"
  vpc_id      = aws_vpc.lotto-lanka.id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-ecs-batch-service"
    }
  )
}

resource "aws_security_group" "internal_game_server_nlb" {
  name        = "lotto internal game server network loadbalancer"
  description = "lotto internal game server network loadbalancer"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description     = "ecs backend services"
    from_port       = 3401
    to_port         = 3401
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_backend_services.id]
  }

  ingress {
    description     = "ecs batch service"
    from_port       = 3401
    to_port         = 3401
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_batch_service.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-internal-game-server-nlb"
    }
  )
}

resource "aws_security_group" "ecs_internal_game_server_service" {
  name        = "lotto ecs internal game server"
  description = "lotto ecs internal game server"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description     = "ecs backend services"
    from_port       = 3401
    to_port         = 3401
    protocol        = "tcp"
    security_groups = [aws_security_group.internal_game_server_nlb.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-ecs-internal-game-server-service"
    }
  )
}

resource "aws_security_group" "rds" {
  name        = "rds"
  description = "rds"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description     = "ec2 bastion"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_bastion.id]
  }

  ingress {
    description     = "ecs internal game server services"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_internal_game_server_service.id]
  }

  ingress {
    description     = "ecs batch services"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_batch_service.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-sg-ecs-rds"
    }
  )
}
