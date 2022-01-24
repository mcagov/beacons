resource "aws_elasticsearch_domain" "opensearch" {
  domain_name           = "${terraform.workspace}-opensearch-service"
  elasticsearch_version = "OS_1.1"


  cluster_config {
    instance_type            = "t3.small.elasticsearch"
    instance_count           = 2
    dedicated_master_enabled = true
    dedicated_master_count   = 3
    dedicated_master_type    = "t3.small.elasticsearch"
    warm_enabled             = false
    zone_awareness_enabled = true

    zone_awareness_config {
      availability_zone_count = var.az_count
    }
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }

  vpc_options {
    security_group_ids = [aws_security_group.opensearch.id]
    subnet_ids         = aws_subnet.app.*.id
  }

  encrypt_at_rest {
    enabled = true
  }

  node_to_node_encryption {
    enabled = true
  }
}