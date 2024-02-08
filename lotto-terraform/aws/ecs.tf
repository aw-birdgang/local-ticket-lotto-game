########################################################################################################################
############################################## global setting ##########################################################
########################################################################################################################

# ecs 생성
resource "aws_ecs_cluster" "lotto_lanka" {
  name = var.project_name
}
# iam 생성
resource "aws_iam_role" "ecs_task_role" {
  name = "lottoEcsTaskRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
      },
    ],
  })
  tags = merge(
    local.tags,
    {
      "Name" = "LottoEcsTaskRole"
    }
  )
}

resource "aws_iam_role_policy" "ecs_exec_docker" {
  name = "ecsExecDokcer"
  role = aws_iam_role.ecs_task_role.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ],
        "Resource" : "*"
      }
    ]
  })
}


resource "aws_iam_role" "ecs_task_execution_role" {
  name = "lottoEcsTaskExecutionRole"

  assume_role_policy = jsonencode({
    "Version" : "2008-10-17",
    "Statement" : [
      {
        "Sid" : "",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ecs-tasks.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
  tags = merge(
    local.tags,
    {
      "Name" = "LottoEcsTaskExecutionRole"
    }
  )
}

resource "aws_iam_role_policy" "ecs_task_execution_role_extra" {
  name = "ecsTaskExecutionRoleExtra"
  role = aws_iam_role.ecs_task_execution_role.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "ecrPermission",
        "Effect" : "Allow",
        "Action" : "ecr:*",
        "Resource" : "*"
      },
      {
        "Sid" : "cloudwatchPermission",
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup"
        ],
        "Resource" : "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  role       = aws_iam_role.ecs_task_execution_role.id
}

########################################################################################################################
################################################# admin api ############################################################
########################################################################################################################

locals {
  admin_api_task_container_name = "admin-api-task"
}

# task definition 생성
resource "aws_ecs_task_definition" "admin_api" {
  family                   = "admin-api-family"
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = local.admin_api_task_container_name,
      image = aws_ecr_repository.lotto-lanka-admin-api.repository_url
      portMappings = [
        {
          containerPort = 3100
          hostPort      = 3100
        }
      ],
      logConfiguration = {
        logDriver : "awslogs"
        options : {
          awslogs-create-group : "true"
          awslogs-group : "/ecs/${local.admin_api_task_container_name}"
          awslogs-region : var.aws_region
          awslogs-stream-prefix : "ecs"
        },
      },

      healthCheck = {
        command = [
          "CMD-SHELL",
          "node healthCheck.js || exit 1"
        ],
        "interval" = 30
        "timeout"  = 5
        "retries"  = 3
      }
    }
  ])
}

# service 생성
resource "aws_ecs_service" "admin_api" {
  name            = "admin-api-service"
  cluster         = aws_ecs_cluster.lotto_lanka.id
  task_definition = aws_ecs_task_definition.admin_api.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = toset(aws_subnet.private_subnets.*.id)
    security_groups = [aws_security_group.ecs_backend_services.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.admin_api.arn
    container_name   = local.admin_api_task_container_name
    container_port   = 3100
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-ecs-service-admin-api"
    }
  )
}

########################################################################################################################
################################################# admin web ############################################################
########################################################################################################################

locals {
  admin_web_task_container_name = "admin-web-task"
}

# task definition 생성
resource "aws_ecs_task_definition" "admin_web" {
  family                   = "admin-web-family"
  cpu                      = 1024
  memory                   = 2048
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = local.admin_web_task_container_name,
      image = aws_ecr_repository.lotto-lanka-admin-web.repository_url
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ],
      logConfiguration = {
        logDriver : "awslogs"
        options : {
          awslogs-create-group : "true"
          awslogs-group : "/ecs/${local.admin_web_task_container_name}"
          awslogs-region : var.aws_region
          awslogs-stream-prefix : "ecs"
        },
      },

      healthCheck = {
        command = [
          "CMD-SHELL",
          "node healthCheck.js || exit 1"
        ],
        "interval" = 30
        "timeout"  = 5
        "retries"  = 3
      }
    }
  ])
}

# service 생성
resource "aws_ecs_service" "admin_web" {
  name            = "admin-web-service"
  cluster         = aws_ecs_cluster.lotto_lanka.id
  task_definition = aws_ecs_task_definition.admin_web.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = toset(aws_subnet.private_subnets.*.id)
    security_groups = [aws_security_group.ecs_web_services.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.admin_web.arn
    container_name   = local.admin_web_task_container_name
    container_port   = 3000
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-ecs-service-admin-web"
    }
  )
}

########################################################################################################################
################################################# player api ###########################################################
########################################################################################################################

locals {
  player_api_task_container_name = "player-api-task"
}

# task definition 생성
resource "aws_ecs_task_definition" "player_api" {
  family                   = "player-api-family"
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = local.player_api_task_container_name,
      image = aws_ecr_repository.lotto-lanka-player-api.repository_url
      portMappings = [
        {
          containerPort = 3200
          hostPort      = 3200
        }
      ],
      logConfiguration = {
        logDriver : "awslogs"
        options : {
          awslogs-create-group : "true"
          awslogs-group : "/ecs/${local.player_api_task_container_name}"
          awslogs-region : var.aws_region
          awslogs-stream-prefix : "ecs"
        },
      },

      healthCheck = {
        command = [
          "CMD-SHELL",
          "node healthCheck.js || exit 1"
        ],
        "interval" = 30
        "timeout"  = 5
        "retries"  = 3
      }
    }
  ])
}

# service 생성
resource "aws_ecs_service" "player_api" {
  name            = "player-api-service"
  cluster         = aws_ecs_cluster.lotto_lanka.id
  task_definition = aws_ecs_task_definition.player_api.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = toset(aws_subnet.private_subnets.*.id)
    security_groups = [aws_security_group.ecs_backend_services.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.player_api.arn
    container_name   = local.player_api_task_container_name
    container_port   = 3200
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-ecs-service-player-api"
    }
  )
}

########################################################################################################################
################################################ seller api ############################################################
########################################################################################################################

locals {
  seller_api_task_container_name = "seller-api-task"
}

# task definition 생성
resource "aws_ecs_task_definition" "seller_api" {
  family                   = "seller-api-family"
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = local.seller_api_task_container_name,
      image = aws_ecr_repository.lotto-lanka-seller-api.repository_url
      portMappings = [
        {
          containerPort = 3500
          hostPort      = 3500
        }
      ],
      logConfiguration = {
        logDriver : "awslogs"
        options : {
          awslogs-create-group : "true"
          awslogs-group : "/ecs/${local.seller_api_task_container_name}"
          awslogs-region : var.aws_region
          awslogs-stream-prefix : "ecs"
        },
      },

      healthCheck = {
        command = [
          "CMD-SHELL",
          "node healthCheck.js || exit 1"
        ],
        "interval" = 30
        "timeout"  = 5
        "retries"  = 3
      }
    }
  ])
}

# service 생성
resource "aws_ecs_service" "seller_api" {
  name            = "seller-api-service"
  cluster         = aws_ecs_cluster.lotto_lanka.id
  task_definition = aws_ecs_task_definition.seller_api.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = toset(aws_subnet.private_subnets.*.id)
    security_groups = [aws_security_group.ecs_backend_services.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.seller_api.arn
    container_name   = local.seller_api_task_container_name
    container_port   = 3500
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-ecs-service-seller-api"
    }
  )
}

########################################################################################################################
################################################# game server ##########################################################
########################################################################################################################

locals {
  game_server_task_container_name = "game-server-task"
}

# task definition 생성
resource "aws_ecs_task_definition" "game_server" {
  family                   = "game-server-family"
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = local.game_server_task_container_name,
      image = aws_ecr_repository.lotto-lanka-game-server.repository_url
      portMappings = [
        {
          containerPort = 3401
          hostPort      = 3401
        }
      ],
      logConfiguration = {
        logDriver : "awslogs"
        options : {
          awslogs-create-group : "true"
          awslogs-group : "/ecs/${local.game_server_task_container_name}"
          awslogs-region : var.aws_region
          awslogs-stream-prefix : "ecs"
        },
      },

      healthCheck = {
        command = [
          "CMD-SHELL",
          "nc -z -w10 localhost 3401 || exit 1"
        ],
        "interval" = 30
        "timeout"  = 5
        "retries"  = 3
      }
    }
  ])
}

# service 생성
resource "aws_ecs_service" "game_server" {
  name            = "game-server-service"
  cluster         = aws_ecs_cluster.lotto_lanka.id
  task_definition = aws_ecs_task_definition.game_server.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = toset(aws_subnet.private_subnets.*.id)
    security_groups = [aws_security_group.ecs_internal_game_server_service.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.internal_game_server.arn
    container_name   = local.game_server_task_container_name
    container_port   = 3401
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-ecs-service-game-server"
    }
  )
}

########################################################################################################################
################################################## batch ###############################################################
########################################################################################################################

locals {
  batch_task_container_name = "batch-task"
}

# task definition 생성
resource "aws_ecs_task_definition" "batch" {
  family                   = "batch-family"
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = local.batch_task_container_name,
      image = aws_ecr_repository.lotto-lanka-batch.repository_url
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ],
      logConfiguration = {
        logDriver : "awslogs"
        options : {
          awslogs-create-group : "true"
          awslogs-group : "/ecs/${local.batch_task_container_name}"
          awslogs-region : var.aws_region
          awslogs-stream-prefix : "ecs"
        },
      },

      healthCheck = {
        command = [
          "CMD-SHELL",
          "node healthCheck.js || exit 1"
        ],
        "interval" = 30
        "timeout"  = 5
        "retries"  = 3
      }
    }
  ])
}

# service 생성
resource "aws_ecs_service" "batch" {
  name            = "batch-service"
  cluster         = aws_ecs_cluster.lotto_lanka.id
  task_definition = aws_ecs_task_definition.batch.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = toset(aws_subnet.private_subnets.*.id)
    security_groups = [aws_security_group.ecs_backend_services.id]
  }
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-ecs-service-batch"
    }
  )
}