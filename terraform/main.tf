terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  profile                  = "auslan"
  region                   = var.region
}

resource "aws_s3_bucket" "data_lake_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.data_lake_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

