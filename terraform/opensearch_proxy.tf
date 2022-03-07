data "aws_ecr_repository" "opensearch_proxy" {
  name = "opensearch-proxy"
}

resource "aws_ecs_cluster" "opensearch_proxy" {
  name = "${terraform.workspace}-opensearch-proxy-cluster"
}

resource "aws_ecs_task_definition" "opensearch_proxy" {
  family                   = "${terraform.workspace}-opensearch-proxy-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.webapp_fargate_cpu
  memory                   = var.webapp_fargate_memory
  container_definitions = jsonencode([{
    name : "opensearch-proxy",
    image : "${data.aws_ecr_repository.opensearch_proxy.repository_url}:${var.opensearch_proxy_image_tag}",
    portMappings : [
      {
        containerPort : 80
        hostPort : 80
      }
    ],
    environment : [
      {
        name : "OPENSEARCH_DOMAIN",
        value : aws_elasticsearch_domain.opensearch.endpoint
      },
      {
        name : "PERMITTED_ORIGIN",
        value : var.public_fqdn
      },
      {
        name : "OPENSEARCH_PROTOCOL",
        value : "https"
      },
    ],
    logConfiguration : {
      "logDriver" : "awslogs",
      "options" : {
        "awslogs-group" : aws_cloudwatch_log_group.log_group.name,
        "awslogs-region" : var.aws_region,
        "awslogs-stream-prefix" : "opensearch-proxy"
      }
    },
    secrets : [
      {
        name : "MASTER_USER",
        valueFrom : aws_secretsmanager_secret.opensearch_master_user_name.arn
      },
      {
        name : "MASTER_PASSWORD",
        valueFrom : aws_secretsmanager_secret.opensearch_master_password.arn
      },
      {
        name : "APPLICATION_CREDENTIALS_BASE64",
        valueFrom : aws_secretsmanager_secret.opensearch_application_credentials_base64.arn
      },
      {
        name : "APPLICATION_USERNAME",
        valueFrom : aws_secretsmanager_secret.opensearch_application_user_name.arn
      },
      {
        name : "APPLICATION_PASSWORD",
        valueFrom : aws_secretsmanager_secret.opensearch_application_password.arn
      },
    ]
  }])
}

resource "aws_ecs_service" "opensearch_proxy" {
  name                              = "${terraform.workspace}-opensearch-proxy"
  cluster                           = aws_ecs_cluster.opensearch_proxy.id
  task_definition                   = aws_ecs_task_definition.opensearch_proxy.arn
  desired_count                     = 1
  launch_type                       = "FARGATE"
  platform_version                  = "1.4.0"
  health_check_grace_period_seconds = 60
  wait_for_steady_state             = true

  network_configuration {
    security_groups = [aws_security_group.opensearch_proxy.id]
    subnets         = aws_subnet.opensearch_proxy.*.id
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.opensearch_proxy.arn
    container_name   = "opensearch-proxy"
    container_port   = 80
  }

  service_registries {
    registry_arn = aws_service_discovery_service.opensearch_proxy.arn
  }

  # OpenSearch proxy start up script creates a new user. There is, therefore, a dependency on the OpenSearch domain.
  depends_on = [aws_iam_role_policy_attachment.ecs_task_execution_role, aws_elasticsearch_domain.opensearch]

  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_service_discovery_service" "opensearch_proxy" {
  name = "opensearch_proxy"

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.private_dns.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 10
      type = "A"
    }
  }
}