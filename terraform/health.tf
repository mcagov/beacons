resource "aws_cloudwatch_metric_alarm" "webapp_health" {
  tags                = module.beacons_label.tags
  namespace           = "AWS/Route53"
  alarm_name          = "webapp-health-alarm"
  metric_name         = "HealthCheckStatus"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "1"
  period              = "60"
  statistic           = "Minimum"
  threshold           = "0"
  alarm_description   = "This metric monitors webapp health"
  provider            = aws.us-east
  alarm_actions       = var.enable_alerts == true ? [aws_sns_topic.sns_service_alerts.arn] : []
  ok_actions          = var.enable_alerts == true ? [aws_sns_topic.sns_service_alerts.arn] : []

  dimensions = {
    HealthCheckId = aws_route53_health_check.webapp_health_check.id
  }
}

resource "aws_route53_health_check" "webapp_health_check" {
  reference_name    = "webapp-health-check"
  tags              = module.beacons_label.tags
  failure_threshold = 5
  fqdn              = var.webapp_fqdn
  port              = 443
  request_interval  = "30"
  resource_path     = var.webapp_health_check_path
  type              = "HTTPS_STR_MATCH"
  search_string     = "Ship shape and Bristol fashion"
}
