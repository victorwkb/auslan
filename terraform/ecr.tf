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
    python_file = md5(file("${path.module}/scripts/transformations/transform.py"))
    docker_file = md5(file("${path.module}/scripts/transformations/Dockerfile"))
  }

  provisioner "local-exec" {
    command = <<EOF
      aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${local.account_id}.dkr.ecr.${var.region}.amazonaws.com
      cd ${path.module}/scripts/transformations
      docker build --platform linux/arm64 -t ${aws_ecr_repository.repo.repository_url}:${local.ecr_image_tag} .
      docker push ${aws_ecr_repository.repo.repository_url}:${local.ecr_image_tag}
    EOF
  }
}

data "aws_ecr_image" "lambda_image" {
  depends_on = [
    null_resource.ecr_image
  ]
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
  memory_size   = 256
  timeout       = 90

  environment {
    variables = {
      S3_BUCKET      = aws_s3_bucket.data_lake_bucket.bucket
      S3_SRC_PREFIX  = "raw"
      S3_DEST_PREFIX = "transformed"
    }
  }
}
