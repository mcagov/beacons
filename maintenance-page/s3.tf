resource "aws_s3_bucket" "maintenance-page" {
  bucket = var.cloudfront_domain_name
  tags   = module.beacons_label.tags
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.maintenance-page.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "s3_policy" {
  bucket = aws_s3_bucket.maintenance-page.id
  policy = data.aws_iam_policy_document.s3_policy.json
}
