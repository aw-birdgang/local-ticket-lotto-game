resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.lotto-lanka.id
}

resource "aws_default_route_table" "default" {
  default_route_table_id = aws_vpc.lotto-lanka.default_route_table_id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}


resource "aws_route_table" "private_rt" {
  count  = length(aws_subnet.private_subnets)
  vpc_id = aws_vpc.lotto-lanka.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat[count.index].id
  }
  tags = merge(local.tags,
    {
      Name = "${var.project_name}-${var.environment}-rtb-private${count.index + 1}-${data.aws_availability_zones.available_az.names[count.index]}"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private_subnets)
  subnet_id      = element(aws_subnet.private_subnets.*.id, count.index)
  route_table_id = aws_route_table.private_rt[count.index].id
}

resource "aws_eip" "nat" {
  count  = length(aws_subnet.private_subnets)
  domain = "vpc"
  tags = merge(local.tags,
    {
      Name = "${var.project_name}-${var.environment}-eip${count.index + 1}-${data.aws_availability_zones.available_az.names[count.index]}"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}

resource "aws_nat_gateway" "nat" {
  count         = length(aws_subnet.public_subnets)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = element(aws_subnet.public_subnets.*.id, count.index)
  tags = merge(local.tags,
    {
      Name = "${var.project_name}-${var.environment}-nat-private-to-public${count.index + 1}-${data.aws_availability_zones.available_az.names[count.index]}"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}

# vpc endpoints
## s3
resource "aws_vpc_endpoint" "s3" {
  service_name    = "com.amazonaws.${var.aws_region}.s3"
  vpc_id          = aws_vpc.lotto-lanka.id
  route_table_ids = aws_route_table.private_rt.*.id
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc-endpint-s3"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}
## ecr-api
resource "aws_vpc_endpoint" "ecr-api" {
  service_name       = "com.amazonaws.${var.aws_region}.ecr.api"
  vpc_id             = aws_vpc.lotto-lanka.id
  vpc_endpoint_type  = "Interface"
  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = aws_subnet.private_subnets.*.id
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc-endpint-ecr-api"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}
## ecr-dkr
resource "aws_vpc_endpoint" "ecr-dkr" {
  service_name       = "com.amazonaws.${var.aws_region}.ecr.dkr"
  vpc_id             = aws_vpc.lotto-lanka.id
  vpc_endpoint_type  = "Interface"
  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = aws_subnet.private_subnets.*.id
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc-endpint-ecr-dkr"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}
## logs
resource "aws_vpc_endpoint" "logs" {
  service_name       = "com.amazonaws.${var.aws_region}.logs"
  vpc_id             = aws_vpc.lotto-lanka.id
  vpc_endpoint_type  = "Interface"
  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = aws_subnet.private_subnets.*.id
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc-endpint-logs"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}
## ssm
resource "aws_vpc_endpoint" "ssm" {
  service_name       = "com.amazonaws.${var.aws_region}.ssm"
  vpc_id             = aws_vpc.lotto-lanka.id
  vpc_endpoint_type  = "Interface"
  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = aws_subnet.private_subnets.*.id
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc-endpint-ssm"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}
## secrets-manager
resource "aws_vpc_endpoint" "secrets-manager" {
  service_name       = "com.amazonaws.${var.aws_region}.secretsmanager"
  vpc_id             = aws_vpc.lotto-lanka.id
  vpc_endpoint_type  = "Interface"
  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = aws_subnet.private_subnets.*.id
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc-endpint-secretsmanager"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}


# security group for vpc endpoints(s3, ecr, logs, ssm, secrets-manager)

resource "aws_security_group" "vpc_endpoints" {
  name        = "lotto private vpc endpoint"
  description = "lotto private vpc endpoint for ecs"
  vpc_id      = aws_vpc.lotto-lanka.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    security_groups = [
      aws_security_group.ecs_backend_services.id, aws_security_group.ecs_web_services.id,
      aws_security_group.ecs_internal_game_server_service.id, aws_security_group.ecs_batch_service.id
    ]
    cidr_blocks = []
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    security_groups = [
      aws_security_group.ecs_backend_services.id, aws_security_group.ecs_web_services.id,
      aws_security_group.ecs_internal_game_server_service.id, aws_security_group.ecs_batch_service.id
    ]
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
      Name = "${var.project_name}-${var.environment}-sg-for-vpc-endpoints"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}