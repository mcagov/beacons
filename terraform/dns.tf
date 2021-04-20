resource "aws_service_discovery_private_dns_namespace" "private_dns" {
  name        = local.dns_sub_domain
  tags        = module.beacons_label.tags
  description = "Private DNS namespace for all Beacons services"
  vpc         = aws_vpc.main.id
}

resource "aws_service_discovery_service" "webapp" {
  name = "webapp"
  tags = module.beacons_label.tags

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.private_dns.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 10
      type = "A"
    }
  }
}

resource "aws_service_discovery_service" "service" {
  name = "service"
  tags = module.beacons_label.tags

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.private_dns.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 10
      type = "A"
    }
  }
}
