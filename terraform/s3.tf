locals {
  environment = terraform.workspace
  b2c_origins = {
    dev     = "https://dev.406beacons.com",
    stage = "https://stage.406beacons.com"
  }
}

resource "aws_s3_bucket" "mca_beacons_b2c_assets" {
  for_each = local.environment == "production" ? {} : { "${local.environment}" = true }
  bucket   = "mca-beacons-b2c-assets-${each.key}"
  acl      = "public-read"
  tags = {
    Name        = "mca-beacons-b2c-assets-${each.key}"
    Environment = "${each.key}"
  }
}

resource "aws_s3_bucket_cors_configuration" "mca_b2c_cors" {
  for_each = aws_s3_bucket.mca_beacons_b2c_assets

  bucket = each.value.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = [
      local.b2c_origins[each.key],
      "https://testb2cmcga.b2clogin.com",
      "http://localhost:3000",
      "https://localhost:3001"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

