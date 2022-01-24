resource "aws_elasticsearch_domain" "opensearch" {
  domain_name           = "${terraform.workspace}-opensearch-service"
  elasticsearch_version = "OS_1.1"


  cluster_config {
    instance_type            = "t3.small.search"
    dedicated_master_enabled = false
    warm_enabled             = false
    instance_count           = 1
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