# ingest lambda role
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
# Redundant with new Step Functions
# eventbridge scheduler role
#resource "aws_iam_role" "eventbridge_iam_role" {
#  name               = var.scheduler_iam_role_name
#  assume_role_policy = data.aws_iam_policy_document.assume_scheduler_role.json
#}
#
#data "aws_iam_policy_document" "assume_scheduler_role" {
#  statement {
#    actions = ["sts:AssumeRole"]
#
#    principals {
#      type        = "Service"
#      identifiers = ["scheduler.amazonaws.com"]
#    }
#
#  }
#}

# attach invoke lambda policy to eventbridge role 
#resource "aws_iam_role_policy" "eventbridge_role_policy" {
#  name   = "eventbridge_role_policy"
#  role   = aws_iam_role.eventbridge_iam_role.id
#  policy = data.aws_iam_policy_document.invoke_lambda_policy.json
#}

#data "aws_iam_policy_document" "invoke_lambda_policy" {
#  statement {
#    actions   = ["lambda:InvokeFunction"]
#    resources = [aws_lambda_function.ingest_data_function.arn]
#  }
#}

# lambda logging policy (during ingestion only)
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
      "s3:ListObjects",
      "s3:ListBucket"
    ]
    resources = [
      aws_s3_bucket.data_lake_bucket.arn,
      "${aws_s3_bucket.data_lake_bucket.arn}/*"
    ]
  }
}

# lambda data transformation in s3 role
resource "aws_iam_role" "transform_lambda_iam_role" {
  name               = var.transform_iam_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_lambda_role.json
}

resource "aws_iam_role_policy" "transform_role_policy" {
  name   = "${var.transform_iam_role_name}-transform-policy"
  role   = aws_iam_role.transform_lambda_iam_role.id
  policy = data.aws_iam_policy_document.write_to_s3_policy.json
}

# lambda encryption policy
resource "aws_iam_role_policy" "lambda_kms_role_policy" {
  name   = "lambda-kms-policy"
  role   = aws_iam_role.transform_lambda_iam_role.id
  policy = data.aws_iam_policy_document.lambda_kms_policy.json
}

data "aws_iam_policy_document" "lambda_kms_policy" {
  statement {
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
    ]
    resources = [aws_kms_key.lambda_env_key.arn]
  }
}

# EricKim204 Date: 5/12/2024
# Added IAM roles and policies for Step Functions to automate data workflow
# Commented out old EventBridge IAM roles and policies

# Step Functions IAM role
resource "aws_iam_role" "step_function_role" {
  name = "lambda-step-function-role"
  assume_role_policy = data.aws_iam_policy_document.assume_states_role.json
}

data "aws_iam_policy_document" "assume_states_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["states.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "step_function_role_policy" {
  name   = "step_function_role_policy"
  role   = aws_iam_role.step_function_role.id
  policy = data.aws_iam_policy_document.invoke_step_function_lambdas_policy.json
}

# Step Functions IAM policy
data "aws_iam_policy_document" "invoke_step_function_lambdas_policy" {
  statement {
    actions   = ["lambda:InvokeFunction"]
    resources = [aws_lambda_function.ingest_data_function.arn,
                aws_lambda_function.transform_data_function.arn,
                aws_lambda_function.vectorize_data_function.arn,
                aws_lambda_function.indexing_data_function.arn]
  }
}
# Step Functions State Machine DEFINITION
resource "aws_sfn_state_machine" "data_workflow" {
  name     = "auslan-data-workflow"
  role_arn = aws_iam_role.step_function_role.arn
  definition = jsonencode({
    "Comment": "Data workflow State Machine linking all Lambda functions",
    "StartAt": "IngestData",
    "States": {
      "IngestData": {
        "Type": "Task",
        "Resource": "${aws_lambda_function.ingest_data_function.arn}",
        "Next": "TransformData"
      },
      "TransformData": {
        "Type": "Task",
        "Resource": "${aws_lambda_function.transform_data_function.arn}",
        "Next": "VectorizeData"
      },
      "VectorizeData": {
        "Type": "Task",
        "Resource": "${aws_lambda_function.vectorize_data_function.arn}",
        "Next": "IndexData"
      },
      "IndexData": {
        "Type": "Task",
        "Resource": "${aws_lambda_function.indexing_data_function.arn}",
        "End": true
      }
    }
  })
}

# Step Functions CloudWatch Event Rule triggered weekly
resource "aws_cloudwatch_event_rule" "weekly_workflow" {
  name                = "auslan-weekly-data-workflow"
  description         = "Triggers the data workflow weekly"
  schedule_expression = "cron(0 0 ? * SUN *)"
}

resource "aws_cloudwatch_event_target" "workflow_target" {
  rule      = aws_cloudwatch_event_rule.weekly_workflow.name
  target_id = "StartDataWorkflow"
  arn       = aws_sfn_state_machine.data_workflow.arn
  role_arn  = aws_iam_role.step_function_role.arn
}

resource "aws_iam_role_policy" "cloudwatch_step_function_execution" {
  name = "cloudwatch_step_function_execution"
  role = aws_iam_role.step_function_role.id
  policy = data.aws_iam_policy_document.cloudwatch_step_function_policy.json
}

data "aws_iam_policy_document" "cloudwatch_step_function_policy" {
  statement {
    actions   = ["states:StartExecution"]
    resources = [aws_sfn_state_machine.data_workflow.arn]
  }
}