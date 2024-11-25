# lambda role
resource "aws_iam_role" "ingest_lambda_iam_role" {
  name               = var.ingest_iam_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_lambda_role.json
}

data "aws_iam_policy_document" "assume_lambda_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# eventbridge scheduler role
resource "aws_iam_role" "eventbridge_iam_role" {
  name               = var.scheduler_iam_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_scheduler_role.json
}

data "aws_iam_policy_document" "assume_scheduler_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com"]
    }

  }
}

# attach invoke lambda policy to eventbridge role 
resource "aws_iam_role_policy" "eventbridge_role_policy" {
  name   = "eventbridge_role_policy"
  role   = aws_iam_role.eventbridge_iam_role.id
  policy = data.aws_iam_policy_document.invoke_lambda_policy.json
}

data "aws_iam_policy_document" "invoke_lambda_policy" {
  statement {
    actions   = ["lambda:InvokeFunction"]
    resources = [aws_lambda_function.ingest_data_function.arn]
  }
}

# lambda logging policy
resource "aws_iam_role_policy" "lambda_logging_role_policy" {
  name   = "${var.ingest_iam_role_name}-logging-policy"
  role   = aws_iam_role.ingest_lambda_iam_role.id
  policy = data.aws_iam_policy_document.allow_logging_policy.json
}

data "aws_iam_policy_document" "allow_logging_policy" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

# lambda write to s3 policy
resource "aws_iam_role_policy" "write_to_s3_role_policy" {
  name   = "${var.ingest_iam_role_name}-write-to-s3-policy"
  role   = aws_iam_role.ingest_lambda_iam_role.id
  policy = data.aws_iam_policy_document.write_to_s3_policy.json
}

data "aws_iam_policy_document" "write_to_s3_policy" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket"
    ]
    resources = [
      aws_s3_bucket.data_lake_bucket.arn,
      "${aws_s3_bucket.data_lake_bucket.arn}/*"
    ]
  }
}

