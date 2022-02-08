data "aws_ecr_repository" "opensearch_proxy" {
  name = "232705206979.dkr.ecr.eu-west-2.amazonaws.com"
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

  network_configuration {
    security_groups = [aws_security_group.opensearch_proxy.id]
    subnets         = aws_subnet.opensearch_proxy.*.id
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.opensearch_proxy.id
    container_name   = "opensearch-proxy"
    container_port   = 80
  }

  service_registries {
    registry_arn = aws_service_discovery_service.webapp.arn
  }

  depends_on = [aws_iam_role_policy_attachment.ecs_task_execution_role]
}
