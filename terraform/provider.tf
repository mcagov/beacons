terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  # Requires S3 bucket & Dynamo DB to be configured, please see README.md
  backend "s3" {
    bucket         = "mca-beacons-state"
    encrypt        = true
    dynamodb_table = var.dynamodb_state_table
    key            = "state"
    region         = "eu-west-2"
  }

  required_version = "~> 0.14"
}

provider "aws" {
  region = var.aws_region
}
