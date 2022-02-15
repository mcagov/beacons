terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.1"
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

  required_version = "~>1.0.0"
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = module.beacons_label.tags
  }
}

provider "aws" {
  alias  = "us-east"
  region = "us-east-1"

  default_tags {
    tags = module.beacons_label.tags
  }
}

locals {
  dns_sub_domain         = "${terraform.workspace}.beacons.local"
  service_local_endpoint = "service.${local.dns_sub_domain}:${var.service_port}/spring-api"
}
