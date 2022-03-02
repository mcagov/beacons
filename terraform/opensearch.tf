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

locals {
  # Local variable necessary for aws_elasticsearch_domain.opensearch.domain_name to be referenced in the domain's access
  # policy.  Reference of domain_name from access_policy would be cyclical, so is not permitted by Terraform.
  # Alternative of hard-coding the domain_name in both locations results in errors should the two locations drift.  DRY.
  opensearch_domain_name = "${terraform.workspace}-beacons"
}

resource "aws_elasticsearch_domain" "opensearch" {
  domain_name           = local.opensearch_domain_name
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
    security_group_ids = [aws_security_group.opensearch.id]
    subnet_ids         = aws_subnet.opensearch.*.id
  }

  encrypt_at_rest {
    enabled = true
  }

  node_to_node_encryption {
    enabled = true
  }

  # TODO: Add to fine grained access policy to limit the actions that a request from the opensearch_proxy can perform.
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
            "Resource": "arn:aws:es:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:domain/${local.opensearch_domain_name}/*"
        }
    ]
}
CONFIG

  # Publish application logs to cloudwatch.
  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.log_group.arn
    log_type                 = "ES_APPLICATION_LOGS"
  }

  depends_on = [data.aws_iam_role.es]
}

# Policy to allow OpenSearch service to publish cloudwatch logs.
resource "aws_cloudwatch_log_resource_policy" "opensearch" {
  policy_name = "opensearch"

  policy_document = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": [
        "logs:PutLogEvents",
        "logs:PutLogEventsBatch",
        "logs:CreateLogStream"
      ],
      "Resource": "arn:aws:logs:*"
    }
  ]
}
CONFIG
}