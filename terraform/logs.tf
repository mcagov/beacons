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

data "aws_iam_policy_document" "log_policy" {
  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.logs.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_alb.main.arn]
    }
  }

  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.logs.arn}/*"]

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
    resources = ["${aws_s3_bucket.logs.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }
  }
}