terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  # Requires S3 bucket & Dynamo DB to be configured, please see README.md
  backend "s3" {
    bucket         = "beacons-terraform-state"
    encrypt        = true
    dynamodb_table = "beacons-terraform-state-lock"
    key            = "state"
    region         = "eu-west-2"
  }

  required_version = "~> 0.14"
}

provider "aws" {
  region = var.aws_region
}

locals {
  dns_sub_domain         = "beacons.${var.env}.local"
  service_local_endpoint = "service.${local.dns_sub_domain}:${var.service_port}"
}