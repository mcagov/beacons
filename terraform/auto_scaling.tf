# Apply Autoscaling to the 'webapp'
module "webapp_autoscaling" {
  source = "./modules/ecs-autoscaling"

  service_name            = aws_ecs_service.webapp.name
  cluster_name            = aws_ecs_cluster.main.name
  ecs_service_resource_id = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.webapp.name}"

  min_capacity = var.webapp_count
  max_capacity = 6
}

# Apply Autoscaling to the 'service'
module "service_autoscaling" {
  source = "./modules/ecs-autoscaling"

  service_name            = aws_ecs_service.service.name
  cluster_name            = aws_ecs_cluster.main.name
  ecs_service_resource_id = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.service.name}"

  min_capacity = var.service_count
  max_capacity = 6
}