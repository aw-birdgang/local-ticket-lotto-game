terraform {

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}