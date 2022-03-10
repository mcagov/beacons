resource "aws_service_discovery_private_dns_namespace" "private_dns" {
  name        = local.dns_sub_domain
  description = "Private DNS namespace for all Beacons services"
  vpc         = aws_vpc.main.id
}

resource "aws_service_discovery_service" "webapp" {
  name = "webapp"

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.private_dns.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_config {
    failure_threshold = 10
    resource_path     = var.webapp_health_check_path
    type              = "HTTP"
  }
}

resource "aws_service_discovery_service" "service" {
  name = "service"

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.private_dns.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_config {
    failure_threshold = 10
    resource_path     = var.service_health_check_path
    type              = "HTTP"
  }
}

resource "aws_service_discovery_service" "backoffice" {
  name = "backoffice"

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.private_dns.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_config {
    failure_threshold = 10
    resource_path     = var.backoffice_health_check_path
    type              = "HTTP"
  }
}
