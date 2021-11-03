variable "name" {}

# An s3 bucket to store the lambda layers in
module "s3_bucket_lambda_layer_store" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "db-backup-lambda-layers-${var.name}"
  acl    = "private"

  versioning = {
    enabled = true
  }
}

# The output s3 for the transformed s3 file
module "s3_bucket_csv" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "dest-db-backup-csv-${var.name}"
  acl    = "private"

  versioning = {
    enabled = true
  }
}

# The output s3 for the database snapshots
module "s3_bucket_snapshots" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "db-snapshots-as-parquet-${var.name}"
  acl    = "private"

  versioning = {
    enabled = true
  }
}

