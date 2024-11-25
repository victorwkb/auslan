data "archive_file" "ingest_zip_file" {
  type        = "zip"
  source_dir  = "${path.module}/scripts/"
  output_path = "${path.module}/scripts/ingest_raw_data.zip"
}

resource "aws_lambda_function" "ingest_data_function" {
  filename      = data.archive_file.ingest_zip_file.output_path
  function_name = var.ingest_lambda_name
  role          = aws_iam_role.ingest_lambda_iam_role.arn
  handler       = "ingest_raw_data.handler"
  runtime       = "python3.11"
  memory_size   = 256
  timeout       = 30

  source_code_hash = filebase64sha256(data.archive_file.ingest_zip_file.output_path)

  environment {
    variables = {
      S3_BUCKET = aws_s3_bucket.data_lake_bucket.bucket
      S3_PREFIX = "raw"
    }
  }
}

resource "aws_scheduler_schedule" "ingest_schedule" {
  name = "ingest_data_schedule"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(0 0 ? * SUN *)"

  target {
    arn      = aws_lambda_function.ingest_data_function.arn
    role_arn = aws_iam_role.eventbridge_iam_role.arn
  }
}
