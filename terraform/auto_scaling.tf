# Apply Autoscaling to the 'webapp'
module "webapp_autoscaling" {
  source    = "./modules/ecs-autoscaling"
  workspace = terraform.workspace

  service_name            = aws_ecs_service.webapp.name
  cluster_name            = aws_ecs_cluster.main.name
  ecs_service_resource_id = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.webapp.name}"

  min_capacity = var.webapp_count # or a hardcoded value like 2
  max_capacity = 6
}

# Apply Autoscaling to the 'service'
module "service_autoscaling" {
  source    = "./modules/ecs-autoscaling"
  workspace = terraform.workspace

  service_name            = aws_ecs_service.service.name
  cluster_name            = aws_ecs_cluster.main.name
  ecs_service_resource_id = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.service.name}"

  min_capacity = 2
  max_capacity = 10 # This service can have different scaling limits
}