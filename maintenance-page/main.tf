terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket         = "mca-beacons-maintenance-page-terraform-state"
    key            = "global/s3/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "beacons-maintenance-page-terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = "eu-west-2"
}
