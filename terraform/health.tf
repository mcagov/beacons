resource "aws_route53_health_check" "webapp-health-check" {
  failure_threshold = "5"
  fqdn              = var.webapp_url
  port              = 443
  request_interval  = "30"
  resource_path     = "/health"
  search_string     = "OK"
  type              = "HTTPS_STR_MATCH"
}

resource "aws_route53_health_check" "service-health-check" {
  failure_threshold = "5"
  fqdn              = var.service_url
  port              = 443
  request_interval  = "30"
  resource_path     = "/health"
  search_string     = "OK"
  type              = "HTTPS_STR_MATCH"
}
