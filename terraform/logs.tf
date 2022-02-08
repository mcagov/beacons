resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/${terraform.workspace}/mca/beacons"
  retention_in_days = 30
}

resource "aws_s3_bucket" "logs" {
  bucket = "${module.beacons_label.namespace}-${module.beacons_label.name}-${module.beacons_label.environment}-logs"
  acl    = "log-delivery-write"
}

resource "aws_s3_bucket_policy" "logs_s3_policy" {
  bucket = aws_s3_bucket.logs.id
  policy = data.aws_iam_policy_document.log_policy.json
}

output "logs_s3_bucket_policy" {
  value = data.aws_iam_policy_document.log_policy.json
}

# Global ELB account ID for eu-west-2 region
# See https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
locals {
  aws_alb_regional_account_id = "652711504416"
}

data "aws_iam_policy_document" "log_policy" {
  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.logs.arn}/${aws_alb.main.access_logs[0].prefix}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"]

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${local.aws_alb_regional_account_id}:root"]
    }
  }

  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.logs.arn}/${aws_alb.main.access_logs[0].prefix}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"]

    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      values   = ["bucket-owner-full-control"]
      variable = "s3:x-amz-acl"
    }
  }

  statement {
    effect    = "Allow"
    actions   = ["s3:GetBucketAcl"]
    resources = [aws_s3_bucket.logs.arn]

    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }
  }
}