variable "name" {}
variable "region" {}
variable "kmsKeyId" {}
variable "accountId" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket = "mca-beacons-db-backup-dev" # this can't be supplied as a variable
    key    = "terraform.tfstate"
    region = "eu-west-2"
  }
  required_version = "~>1.0.0"
}

provider "aws" {
  region = var.region
}

module "buckets" {
  source = "./tf-modules/s3"
  name = var.name
}

module "roles" {
  source = "./tf-modules/roles"
  name = var.name
  snapshots_arn = module.buckets.snapshots_bucket.s3_bucket_arn
}

module "lambdas" {
  source = "./tf-modules/lambda"
  name = var.name
  s3_lambda_layer_store = module.buckets.layer_store_bucket
  s3_snapshots_bucket = module.buckets.snapshots_bucket
  s3_csv_bucket = module.buckets.csv_bucket
  transform_lambda_role = module.roles.transform_lambda_role
  export_lambda_role = module.roles.export_lambda_role 
  accountId = var.accountId
  kmsKeyId = var.kmsKeyId
  region = var.region
}

module "triggers" {
  source = "./tf-modules/triggers"
  name = var.name
  transform_lambda = module.lambdas.transform_lambda
  cron_lambda = module.lambdas.cron_lambda
  snapshots_bucket = module.buckets.snapshots_bucket
}


output "s3_bucket_db_snapshot_id" {
  value = module.buckets.snapshots_bucket.s3_bucket_id
}

output "s3_bucket_csv_id" {
  value = module.buckets.csv_bucket.s3_bucket_id
}

output "lambda_name" {
  value = module.lambdas.transform_lambda.lambda_function_name
}
