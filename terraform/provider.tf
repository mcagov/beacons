terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket = "mca-beacons-state"
    key    = "state"
    region = "eu-west-2"
  }

  required_version = "~> 0.14"
}

provider "aws" {
  region = var.aws_region
}
