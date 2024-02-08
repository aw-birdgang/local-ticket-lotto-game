#################
# ecs game server
#################
resource "aws_lb" "ecs_internal_game_server" {
  name               = "ecs-internal-game-server"
  internal           = true
  load_balancer_type = "network"
  security_groups    = [aws_security_group.ecs_internal_game_server_service.id]
  subnets            = toset(aws_subnet.private_subnets.*.id)

  enable_deletion_protection = false

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-nlb-game-server"
  })
}

resource "aws_lb_target_group" "internal_game_server" {
  name        = "ecs-internal-game-server"
  port        = 3401
  protocol    = "TCP"
  target_type = "ip"
  vpc_id      = aws_vpc.lotto-lanka.id

  health_check {
    healthy_threshold   = 3
    unhealthy_threshold = 2
    timeout             = 10
    interval            = 10
    port                = "traffic-port"
    protocol            = "TCP"
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-tg-game-server"
  })
}

resource "aws_lb_listener" "internal_game_server" {
  load_balancer_arn = aws_lb.ecs_internal_game_server.arn
  port              = 3401
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.internal_game_server.arn
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-ecs-internal-game-server"
  })
}

###########
# admin api
###########
resource "aws_lb" "admin_api" {
  name               = "admin-api"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.backend_services_alb.id]
  subnets            = toset(aws_subnet.public_subnets.*.id)

  enable_deletion_protection = false

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-alb-admin-api"
  })
}

resource "aws_lb_target_group" "admin_api" {
  name        = "admin-api"
  port        = 3100
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.lotto-lanka.id

  health_check {
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/api/health"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-tg-admin-api"
  })
}

resource "aws_lb_listener" "admin_api_http" {
  load_balancer_arn = aws_lb.admin_api.arn
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

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-admin-api-http"
  })
}

resource "aws_lb_listener" "admin_api_https" {
  load_balancer_arn = aws_lb.admin_api.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.admin_api.arn
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-admin-api-https"
  })
}

############
# seller api
############
resource "aws_lb" "seller_api" {
  name               = "seller-api"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.backend_services_alb.id]
  subnets            = toset(aws_subnet.public_subnets.*.id)

  enable_deletion_protection = false

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-seller-api"
  })
}

resource "aws_lb_target_group" "seller_api" {
  name        = "seller-api"
  port        = 3500
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.lotto-lanka.id

  health_check {
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/api/health"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-tg-seller-api"
  })
}

resource "aws_lb_listener" "seller_api_http" {
  load_balancer_arn = aws_lb.seller_api.arn
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
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-seller-api-http"
  })
}

resource "aws_lb_listener" "seller_api_https" {
  load_balancer_arn = aws_lb.seller_api.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.seller_api.arn
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-seller-api-https"
  })
}

############
# player api
############
resource "aws_lb" "player_api" {
  name               = "player-api"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.backend_services_alb.id]
  subnets            = toset(aws_subnet.public_subnets.*.id)

  enable_deletion_protection = false

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-player-api"
  })
}

resource "aws_lb_target_group" "player_api" {
  name        = "player-api"
  port        = 3200
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.lotto-lanka.id

  health_check {
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/api/health"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-tg-player-api"
  })
}

resource "aws_lb_listener" "player_api_http" {
  load_balancer_arn = aws_lb.player_api.arn
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
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-player-api-http"
  })
}

resource "aws_lb_listener" "player_api_https" {
  load_balancer_arn = aws_lb.player_api.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.player_api.arn
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-player-api-https"
  })
}

###########
# admin web
###########
resource "aws_lb" "admin_web" {
  name               = "admin-web"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web_services_alb.id]
  subnets            = toset(aws_subnet.public_subnets.*.id)

  enable_deletion_protection = false

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-admin-web"
  })
}

resource "aws_lb_target_group" "admin_web" {
  name        = "admin-web"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.lotto-lanka.id

  health_check {
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/api/health"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-tg-admin-web"
  })
}

resource "aws_lb_listener" "admin_web_http" {
  load_balancer_arn = aws_lb.admin_web.arn
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
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-admin-web-http"
  })
}

resource "aws_lb_listener" "admin_web_https" {
  load_balancer_arn = aws_lb.admin_web.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.admin_web.arn
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-lb-listener-admin-web-https"
  })
}