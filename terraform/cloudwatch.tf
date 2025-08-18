module "aws-rds-alarms" {
  source                               = "lorenzoaiello/rds-alarms/aws"
  version                              = "2.4.1"
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
  threshold           = var.api_service_minimum_task_count
  treat_missing_data  = "breaching"
  alarm_description   = "Task count is too low."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.service.name}"

  }
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
  treat_missing_data  = "breaching"
  alarm_description   = "Average CPU utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.service.name}"

  }
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
  treat_missing_data  = "breaching"
  alarm_description   = "Average Memory utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.service.name}"

  }
}

resource "aws_cloudwatch_metric_alarm" "ecs_webapp_task_count_too_low" {
  alarm_name          = "ecs-${aws_ecs_service.webapp.name}-lowTaskCount"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "SampleCount"
  threshold           = var.webapp_minimum_task_count
  treat_missing_data  = "breaching"
  alarm_description   = "Task count is too low."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.webapp.name}"

  }
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
  treat_missing_data  = "breaching"
  alarm_description   = "Average CPU utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.webapp.name}"

  }
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
  treat_missing_data  = "breaching"
  alarm_description   = "Average Memory utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ClusterName = "${aws_ecs_cluster.main.name}"
    ServiceName = "${aws_ecs_service.webapp.name}"

  }
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
  treat_missing_data  = "breaching"
  alarm_description   = "Average Memory utilization is too high."
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    ReplicationGroupId = "${terraform.workspace}-mca-beacons-elasticache-cluster"

  }
}

resource "aws_cloudwatch_metric_alarm" "alb_4xx_error_alarm" {
  alarm_name          = "${terraform.workspace}-ALB-4xx-High-Error-Count"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  metric_name         = "HTTPCode_Target_4XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0.05

  alarm_description = "This alarm triggers when the ALB target group has a high number of 4xx server related errors."
  alarm_actions     = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions        = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    LoadBalancer = aws_alb.main.arn_suffix
    TargetGroup  = aws_alb_target_group.webapp.arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "alb_5xx_error_alarm" {
  alarm_name          = "${terraform.workspace}-ALB-5xx-High-Error-Count"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 3
  datapoints_to_alarm = 3
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0.05
  alarm_description   = "This alarm triggers when the ALB target group has a high number of 5xx server related errors."

  alarm_actions = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  ok_actions    = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []

  dimensions = {
    LoadBalancer = aws_alb.main.arn_suffix
    TargetGroup  = aws_alb_target_group.webapp.arn_suffix
  }
}
