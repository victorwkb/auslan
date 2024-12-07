# transform to csv
locals {
  prefix              = "lancedb"
  account_id          = data.aws_caller_identity.current.account_id
  ecr_repository_name = local.prefix
  ecr_image_tag       = "latest"
}

# last resort, however automates image pushing
resource "null_resource" "ecr_image" {
  triggers = {
    python_file   = md5(file("${path.module}/scripts/transformations/transform.py"))
    python_file_2 = md5(file("${path.module}/scripts/transformations/vectorize.py"))
    python_file_3 = md5(file("${path.module}/scripts/transformations/indexing.py"))
    python_file_4 = md5(file("${path.module}/scripts/transformations/query.py"))
    docker_file   = md5(file("${path.module}/scripts/transformations/Dockerfile"))
  }

  provisioner "local-exec" {
    command = <<EOF
      aws ecr-public get-login-password | docker login --password-stdin --username AWS public.ecr.aws
      aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${local.account_id}.dkr.ecr.${var.region}.amazonaws.com
      cd ${path.module}/scripts/transformations
      docker build --platform linux/arm64 -t ${aws_ecr_repository.repo.repository_url}:${local.ecr_image_tag} .
      docker push ${aws_ecr_repository.repo.repository_url}:${local.ecr_image_tag} 
    EOF
  }
}

data "aws_ecr_image" "lambda_image" {
  depends_on = [null_resource.ecr_image]
  repository_name = local.ecr_repository_name
  image_tag       = local.ecr_image_tag
}

resource "aws_lambda_function" "transform_data_function" {
  depends_on    = [null_resource.ecr_image]
  function_name = var.transform_lambda_name
  role          = aws_iam_role.transform_lambda_iam_role.arn
  image_uri     = "${aws_ecr_repository.repo.repository_url}@${data.aws_ecr_image.lambda_image.id}"
  architectures = ["arm64"]
  package_type  = "Image"
  memory_size   = 512
  timeout       = 90

  # env variables encryption
  kms_key_arn = aws_kms_key.lambda_env_key.arn

  image_config {
    command = ["transform.handler"]
  }

  environment {
    variables = {
      S3_BUCKET      = aws_s3_bucket.data_lake_bucket.bucket
      S3_SRC_PREFIX  = "bronze"
      S3_DEST_PREFIX = "silver"
    }
  }
}

resource "aws_lambda_function" "vectorize_data_function" {
  depends_on    = [null_resource.ecr_image]
  function_name = var.vectorize_lambda_name
  role          = aws_iam_role.transform_lambda_iam_role.arn
  image_uri     = "${aws_ecr_repository.repo.repository_url}@${data.aws_ecr_image.lambda_image.id}"
  architectures = ["arm64"]
  package_type  = "Image"
  memory_size   = 2048
  timeout       = 900

  # env variables encryption
  kms_key_arn = aws_kms_key.lambda_env_key.arn

  image_config {
    command = ["vectorize.handler"]
  }

  environment {
    variables = {
      S3_BUCKET                 = aws_s3_bucket.data_lake_bucket.bucket
      S3_SRC_PREFIX             = "bronze"
      S3_DEST_PREFIX            = "silver"
      BEDROCK_ACCESS_KEY_ID     = var.access_key_id
      BEDROCK_SECRET_ACCESS_KEY = var.secret_access_key
      BEDROCK_REGION            = var.region
    }
  }
}

resource "aws_lambda_function" "indexing_data_function" {
  depends_on    = [null_resource.ecr_image]
  function_name = var.indexing_lambda_name
  role          = aws_iam_role.transform_lambda_iam_role.arn
  image_uri     = "${aws_ecr_repository.repo.repository_url}@${data.aws_ecr_image.lambda_image.id}"
  architectures = ["arm64"]
  package_type  = "Image"
  memory_size   = 1536
  timeout       = 300

  # env variables encryption
  kms_key_arn = aws_kms_key.lambda_env_key.arn

  ephemeral_storage {
    size = 2000
  }

  image_config {
    command = ["indexing.handler"]
  }

  environment {
    variables = {
      S3_BUCKET      = aws_s3_bucket.data_lake_bucket.bucket
      S3_DEST_PREFIX = "silver"
    }
  }
}

resource "aws_lambda_function" "query_function" {
  depends_on    = [null_resource.ecr_image]
  function_name = var.query_lambda_name
  role          = aws_iam_role.transform_lambda_iam_role.arn
  image_uri     = "${aws_ecr_repository.repo.repository_url}@${data.aws_ecr_image.lambda_image.id}"
  architectures = ["arm64"]
  package_type  = "Image"
  memory_size   = 2048
  timeout       = 60

  # env variables encryption
  kms_key_arn = aws_kms_key.lambda_env_key.arn

  image_config {
    command = ["query.handler"]
  }

  environment {
    variables = {
      S3_BUCKET                 = aws_s3_bucket.data_lake_bucket.bucket
      S3_DEST_PREFIX            = "silver"
      BEDROCK_ACCESS_KEY_ID     = var.access_key_id
      BEDROCK_SECRET_ACCESS_KEY = var.secret_access_key
      BEDROCK_REGION            = var.region
    }
  }
}
