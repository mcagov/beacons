data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_iam_role" "es" {
  # OpenSearch depends on having an IAM service-linked role available
  #
  # AWS only allows one service-linked role per account per service, because the service-linked role is associated with
  # the whole _OpenSearch service_, not a particular OpenSearch cluster/domain _resource_, which can be controlled by
  # TerraForm.
  #
  # Therefore, an IAM service-linked role must be created manually in the AWS account, independent of Terraform, and
  # referenced as data.
  name = "AWSServiceRoleForAmazonElasticsearchService"
}

resource "aws_elasticsearch_domain" "opensearch" {
  domain_name           = "${terraform.workspace}-opensearch-service"
  elasticsearch_version = "OpenSearch_1.1"

  advanced_security_options {
    enabled                        = true
    internal_user_database_enabled = true

    master_user_options {
      master_user_name     = var.opensearch_master_user_name
      master_user_password = var.opensearch_master_user_password
    }
  }

  cluster_config {
    instance_type            = var.opensearch_instance_type
    instance_count           = var.opensearch_instance_count
    dedicated_master_enabled = true
    dedicated_master_type    = var.opensearch_dedicated_master_type
    dedicated_master_count   = var.opensearch_master_node_count
    warm_enabled             = false
    zone_awareness_enabled   = true

    zone_awareness_config {
      availability_zone_count = var.az_count
    }
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = var.opensearch_ebs_volume_size
  }

  vpc_options {
    security_group_ids = [aws_security_group.opensearch_public.id]
    subnet_ids         = aws_subnet.opensearch.*.id
  }

  encrypt_at_rest {
    enabled = true
  }

  node_to_node_encryption {
    enabled = true
  }

  access_policies = <<CONFIG
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "es:*",
            "Principal": {
              "AWS": "*"
            },
            "Effect": "Allow",
            "Resource": "arn:aws:es:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:domain/${terraform.workspace}-opensearch-service/*"
        }
    ]
}
CONFIG

  depends_on = [data.aws_iam_role.es]
}