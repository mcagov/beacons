resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/${terraform.workspace}/mca/beacons"
  retention_in_days = 30
}

# Global ELB account ID for eu-west-2 region
# See https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
locals {
  aws_alb_regional_account_id = "652711504416"
  logging_s3_bucket_name      = "${module.beacons_label.namespace}-${module.beacons_label.name}-${module.beacons_label.environment}-logs"
}

resource "aws_s3_bucket" "logs" {
  bucket = local.logging_s3_bucket_name
  acl    = "log-delivery-write"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowELBRootAccount",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${local.aws_alb_regional_account_id}:root"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${local.logging_s3_bucket_name}/*"
    },
    {
      "Sid": "AWSLogDeliveryWrite",
      "Effect": "Allow",
      "Principal": {
        "Service": "delivery.logs.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${local.logging_s3_bucket_name}/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-acl": "bucket-owner-full-control"
        }
      }
    },
    {
      "Sid": "AWSLogDeliveryAclCheck",
      "Effect": "Allow",
      "Principal": {
        "Service": "delivery.logs.amazonaws.com"
      },
      "Action": "s3:GetBucketAcl",
      "Resource": "arn:aws:s3:::${local.logging_s3_bucket_name}"
    }
  ]
}
POLICY
}