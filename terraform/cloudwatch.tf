module "aws-rds-alarms" {
  source                               = "lorenzoaiello/rds-alarms/aws"
  version                              = "2.1.0"
  db_instance_id                       = aws_db_instance.postgres.id
  db_instance_class                    = var.db_instance_class
  actions_alarm                        = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  actions_ok                           = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  disk_burst_balance_too_low_threshold = var.low_disk_burst_balance_threshold
}

resource "aws_cloudwatch_metric_alarm" "ecs_service_task_count_too_low" {
  alarm_name          = "ecs-${aws_ecs_service.service.name}-lowTaskCount"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "SampleCount"
  threshold           = 1
  alarm_description   = "Task count is too low."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.service.name}"

  }
  tags = module.beacons_label.tags
}

resource "aws_cloudwatch_metric_alarm" "ecs_service_cpu_too_high" {
  alarm_name          = "ecs-${aws_ecs_service.service.name}-highCPUUtilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Average CPU utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.service.name}"

  }
  tags = module.beacons_label.tags
}

resource "aws_cloudwatch_metric_alarm" "ecs_service_memory_too_high" {
  alarm_name          = "ecs-${aws_ecs_service.service.name}-highMemoryUtilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Average Memory utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.service.name}"

  }
  tags = module.beacons_label.tags
}

resource "aws_cloudwatch_metric_alarm" "ecs_webapp_task_count_too_low" {
  alarm_name          = "ecs-${aws_ecs_service.webapp.name}-lowTaskCount"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "SampleCount"
  threshold           = 1
  alarm_description   = "Task count is too low."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.webapp.name}"

  }
  tags = module.beacons_label.tags
}

resource "aws_cloudwatch_metric_alarm" "ecs_webapp_cpu_too_high" {
  alarm_name          = "ecs-${aws_ecs_service.webapp.name}-highCPUUtilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Average CPU utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.webapp.name}"

  }
  tags = module.beacons_label.tags
}

resource "aws_cloudwatch_metric_alarm" "ecs_webapp_memory_too_high" {
  alarm_name          = "ecs-${aws_ecs_service.webapp.name}-highMemoryUtilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Average Memory utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.webapp.name}"

  }
  tags = module.beacons_label.tags
}

resource "aws_cloudwatch_metric_alarm" "redis_memory_too_high" {
  alarm_name          = "redis-${terraform.workspace}-highMemoryUtilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "DatabaseMemoryUsageCountedForEvictPercentage"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Average Memory utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ReplicationGroupId = "${terraform.workspace}-mca-beacons-elasticache-cluster"

  }
  tags = module.beacons_label.tags
}
