data "aws_ecr_repository" "webapp" {
  name = var.webapp_image
}

data "aws_ecr_repository" "service" {
  name = var.service_image
}

resource "aws_ecs_cluster" "main" {
  name = "${var.env}-mca-beacons-cluster"
}

resource "aws_ecs_task_definition" "webapp" {
  family                   = "${var.env}-beacons-webapp-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.webapp_fargate_cpu
  memory                   = var.webapp_fargate_memory
  container_definitions = jsonencode([{
    name : "beacons-webapp",
    image : "${data.aws_ecr_repository.webapp.repository_url}:${var.webapp_image_tag}",
    portMappings : [
      {
        containerPort : var.webapp_port
        hostPort : var.webapp_port
      }
    ],
    environment : [
      {
        name : "API_URL",
        value : "${local.service_local_endpoint}"
      }
    ],
    logConfiguration : {
      "logDriver" : "awslogs",
      "options" : {
        "awslogs-group" : aws_cloudwatch_log_group.log_group.name,
        "awslogs-region" : var.aws_region,
        "awslogs-stream-prefix" : "webapp"
      }
    }
  }])
}

resource "aws_ecs_service" "webapp" {
  name             = "${var.env}-beacons-webapp"
  cluster          = aws_ecs_cluster.main.id
  task_definition  = aws_ecs_task_definition.webapp.arn
  desired_count    = var.webapp_count
  launch_type      = "FARGATE"
  platform_version = "1.3.0"

  network_configuration {
    security_groups = [aws_security_group.ecs_tasks.id]
    subnets         = aws_subnet.app.*.id
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.webapp.id
    container_name   = "beacons-webapp"
    container_port   = var.webapp_port
  }

  service_registries {
    registry_arn = aws_service_discovery_service.webapp.arn
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
}

resource "aws_ecs_task_definition" "service" {
  family                   = "${var.env}-beacons-service-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.service_fargate_cpu
  memory                   = var.service_fargate_memory
  container_definitions = jsonencode([{
    name : "beacons-service",
    image : "${data.aws_ecr_repository.service.repository_url}:${var.service_image_tag}",
    portMappings : [
      {
        containerPort : var.service_port
        hostPort : var.service_port
      }
    ],
    environment : [
      {
        name : "SPRING_DATASOURCE_URL",
        value : "jdbc:postgresql://${aws_db_instance.postgres.endpoint}/${var.db_name}?sslmode=require"
      },
      {
        name : "SPRING_DATASOURCE_USER",
        value : var.db_username
      }
    ],
    logConfiguration : {
      "logDriver" : "awslogs",
      "options" : {
        "awslogs-group" : aws_cloudwatch_log_group.log_group.name,
        "awslogs-region" : var.aws_region,
        "awslogs-stream-prefix" : "service"
      }
    },
    secrets : [
      {
        name : "SPRING_DATASOURCE_PASSWORD",
        valueFrom : aws_secretsmanager_secret.db_password.arn
    }]
  }])
}

resource "aws_ecs_service" "service" {
  name             = "${var.env}-beacons-service"
  cluster          = aws_ecs_cluster.main.id
  task_definition  = aws_ecs_task_definition.service.arn
  desired_count    = var.service_count
  launch_type      = "FARGATE"
  platform_version = "1.3.0"

  network_configuration {
    security_groups = [aws_security_group.ecs_tasks.id]
    subnets         = aws_subnet.app.*.id
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.service.id
    container_name   = "beacons-service"
    container_port   = var.service_port
  }

  service_registries {
    registry_arn = aws_service_discovery_service.service.arn
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
}
