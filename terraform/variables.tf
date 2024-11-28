variable "region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-2"
}

variable "access_key_id" {
  description = "The AWS access key ID"
  type        = string
  sensitive   = true
}

variable "secret_access_key" {
  description = "The AWS secret access key"
  type        = string
  sensitive   = true
}

variable "bucket_name" {
  description = "The name of the S3 bucket for all data"
  type        = string
  default     = "auslan-data-lake-bucket"
}

variable "ingest_lambda_name" {
  description = "The name of the ingest Lambda function"
  type        = string
  default     = "auslan_ingest_data_function"
}

variable "ingest_iam_role_name" {
  description = "The name of the IAM role for the ingest Lambda function"
  type        = string
  default     = "auslan_ingest_iam_role"
}

variable "scheduler_iam_role_name" {
  description = "The name of the IAM role for the eventbridge scheduler"
  type        = string
  default     = "auslan_scheduler_iam_role"
}

variable "transform_iam_role_name" {
  description = "The name of the IAM role for the transform Lambda function"
  type        = string
  default     = "auslan_transform_iam_role"
}

variable "ecr_repository_name" {
  description = "The name of the ECR repository"
  type        = string
  default     = "lancedb"
}

variable "transform_lambda_name" {
  description = "The name of the transform Lambda function"
  type        = string
  default     = "auslan_transform_data_function"
}

variable "vectorize_lambda_name" {
  description = "The name of the vectorize Lambda function"
  type        = string
  default     = "auslan_vectorize_data_function"
}
