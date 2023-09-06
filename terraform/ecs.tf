data "aws_ecr_repository" "webapp" {
  name = var.webapp_image
}

data "aws_ecr_repository" "service" {
  name = var.service_image
}

data "aws_ecr_repository" "backoffice" {
  name = var.backoffice_image
}

resource "aws_ecs_cluster" "main" {
  name = "${terraform.workspace}-mca-beacons-cluster"
}

resource "aws_ecs_task_definition" "webapp" {
  family                   = "${terraform.workspace}-beacons-webapp-task"
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
        value : "http://${local.service_local_endpoint}"
      },
      {
        name : "WEBAPP_CLIENT_ID",
        value : var.webapp_azure_ad_client_id
      },
      {
        name : "AAD_API_ID",
        value : var.service_azure_ad_api_id
      },
      {
        name : "AAD_TENANT_ID",
        value : var.azure_ad_tenant_id
      },
      {
        name : "REDIS_URI",
        value : "redis://${aws_elasticache_cluster.main.cache_nodes[0].address}:${var.redis_port}"
      },
      {
        name : "NEXTAUTH_URL",
        value : var.webapp_next_auth_url
      },
      {
        name : "AZURE_B2C_CLIENT_ID",
        value : var.webapp_azure_b2c_client_id
      },
      {
        name : "AZURE_B2C_TENANT_NAME",
        value : var.webapp_azure_b2c_tenant_name
      },
      {
        name : "AZURE_B2C_TENANT_ID",
        value : var.webapp_azure_b2c_tenant_id
      },
      {
        name : "AZURE_B2C_LOGIN_FLOW",
        value : var.webapp_azure_b2c_login_flow
      },
      {
        name : "AZURE_B2C_SIGNUP_FLOW",
        value : var.webapp_azure_b2c_signup_flow
      },
      {
        name : "GOV_NOTIFY_FEEDBACK_EMAIL_ADDRESS",
        value : var.gov_notify_feedback_email_address
      }
    ],
    logConfiguration : {
      "logDriver" : "awslogs",
      "options" : {
        "awslogs-group" : aws_cloudwatch_log_group.log_group.name,
        "awslogs-region" : var.aws_region,
        "awslogs-stream-prefix" : "webapp"
      }
    },
    secrets : [
      {
        name : "GOV_NOTIFY_API_KEY",
        valueFrom : aws_secretsmanager_secret.gov_notify_api_key.arn
      },
      {
        name : "WEBAPP_CLIENT_SECRET",
        valueFrom : aws_secretsmanager_secret.webapp_client_secret.arn
      },
      {
        name : "AZURE_B2C_CLIENT_SECRET",
        valueFrom : aws_secretsmanager_secret.webapp_b2c_client_secret.arn
      },
      {
        name : "JWT_SECRET",
        valueFrom : aws_secretsmanager_secret.webapp_next_auth_jwt_secret.arn
      }
    ],
    healthCheck : {
      retries : 6,
      command : [
        "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/api/health &>/dev/null || exit 1"
      ],
    }
  }])
}

resource "aws_ecs_service" "webapp" {
  name                              = "${terraform.workspace}-beacons-webapp"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.webapp.arn
  desired_count                     = var.webapp_count
  launch_type                       = "FARGATE"
  platform_version                  = "1.4.0"
  health_check_grace_period_seconds = 60
  wait_for_steady_state             = true

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
  family                   = "${terraform.workspace}-beacons-service-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.service_fargate_cpu
  memory                   = var.service_fargate_memory

  volume {
    name = aws_efs_file_system.service-filesystem.creation_token
    efs_volume_configuration {
      file_system_id = aws_efs_file_system.service-filesystem.id
    }
  }

  container_definitions = jsonencode([{
    name : "beacons-service",
    image : "${data.aws_ecr_repository.service.repository_url}:${var.service_image_tag}",
    portMappings : [
      {
        containerPort : var.service_port
        hostPort : var.service_port
      }
    ],
    mountPoints : [
      {
        containerPath : "/var/export",
        sourceVolume : aws_efs_file_system.service-filesystem.creation_token
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
      },
      {
        name : "SPRING_BASIC_AUTH_USERNAME",
        value : var.service_basic_auth_username
      },
      {
        name : "SPRING_BASIC_AUTH_PASSWORD",
        value : var.service_basic_auth_password
      },
      {
        name : "SPRING_PROFILES_ACTIVE",
        value : var.service_spring_active_profiles
      },
      {
        name : "BEACONS_SEARCH_VIEW_SCHEDULER_TIMEOUT",
        value : var.service_beacon_search_scheduler_timeout
      },
      {
        name : "AZURE_AD_API_CLIENT_ID",
        value : var.service_azure_ad_api_id
      },
      {
        name : "AZURE_AD_API_ID_URI",
        value : "api://${var.service_azure_ad_api_id}"
      },
      {
        name : "OPENSEARCH_ENDPOINT",
        value : aws_elasticsearch_domain.opensearch.endpoint
      },
      {
        name : "OPENSEARCH_USER",
        value : var.opensearch_master_user_name
      },
      {
        name : "MICROSOFT_GRAPH_CLIENT_ID",
        value : var.microsoft_graph_client_id
      },
      {
        name : "MICROSOFT_GRAPH_CLIENT_SECRET",
        value : var.microsoft_graph_client_secret
      },
      {
        name : "MICROSOFT_GRAPH_B2C_TENANT_ID",
        value : var.microsoft_graph_b2c_tenant_id
      },
      {
        name : "MICROSOFT_GRAPH_B2C_TENANT_NAME",
        value : var.microsoft_graph_b2c_tenant_name
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
      },
      {
        name : "OPENSEARCH_PASSWORD",
        valueFrom : aws_secretsmanager_secret.opensearch_master_password.arn
      }
    ],
    healthCheck : {
      startPeriod : 30,
      retries : 6,
      command : ["CMD-SHELL", "curl -f http://localhost:8080/spring-api/actuator/health &>/dev/null || exit 1"],
    }
  }])
}

resource "aws_ecs_service" "service" {
  name                              = "${terraform.workspace}-beacons-service"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.service.arn
  desired_count                     = var.service_count
  launch_type                       = "FARGATE"
  platform_version                  = var.ecs_fargate_version
  health_check_grace_period_seconds = 600
  wait_for_steady_state             = true

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

locals {
  backoffice_container_name = "beacons-backoffice"
}

resource "aws_ecs_task_definition" "backoffice" {
  family                   = "${terraform.workspace}-beacons-backoffice-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.backoffice_fargate_cpu
  memory                   = var.backoffice_fargate_memory
  container_definitions = jsonencode([{
    name : local.backoffice_container_name
    image : "${data.aws_ecr_repository.backoffice.repository_url}:${var.backoffice_image_tag}"
    portMappings : [
      {
        containerPort : var.backoffice_port
        hostPort : var.backoffice_port
      }
    ],
    environment : [
      {
        name : "AZURE_AD_TENANT_ID",
        value : var.azure_ad_tenant_id
      },
      {
        name : "AZURE_AD_CLIENT_ID",
        value : var.backoffice_azure_ad_client_id
      },
    ]
    logConfiguration : {
      "logDriver" : "awslogs",
      "options" : {
        "awslogs-group" : aws_cloudwatch_log_group.log_group.name
        "awslogs-region" : var.aws_region
        "awslogs-stream-prefix" : "backoffice"
      }
    },
    healthCheck : {
      retries : 6,
      command : ["CMD-SHELL", "curl -f http://localhost:80/health &>/dev/null || exit 1"],
    }
  }])
}

resource "aws_ecs_service" "backoffice" {
  name                              = "${terraform.workspace}-beacons-backoffice"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.backoffice.arn
  desired_count                     = var.backoffice_count
  launch_type                       = "FARGATE"
  platform_version                  = var.ecs_fargate_version
  health_check_grace_period_seconds = 600
  wait_for_steady_state             = true

  network_configuration {
    security_groups = [aws_security_group.ecs_tasks.id]
    subnets         = aws_subnet.app.*.id
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.backoffice.id
    container_name   = local.backoffice_container_name
    container_port   = var.backoffice_port
  }

  service_registries {
    registry_arn = aws_service_discovery_service.backoffice.arn
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
}
