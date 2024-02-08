# dotenv
resource "aws_s3_bucket" "dotenv" {
  bucket        = "${var.project_name}-${var.environment}-dotenv"
  force_destroy = var.force_destroy

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-s3-dotenv"
    }
  )
}

resource "aws_s3_bucket_server_side_encryption_configuration" "dotenv_s3_kms" {
  bucket = aws_s3_bucket.dotenv.id

  rule {
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_logging" "logging_dotenv" {
  bucket = aws_s3_bucket.dotenv.id

  target_bucket = aws_s3_bucket.s3_access_logs.id
  target_prefix = "${aws_s3_bucket.dotenv.id}/"

  target_object_key_format {
    simple_prefix {}
  }
}

# service storage
resource "aws_s3_bucket" "service_storage" {
  bucket        = "${var.project_name}-${var.environment}-service-storage"
  force_destroy = var.force_destroy

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-s3-service-storage"
    }
  )
}

resource "aws_s3_bucket_public_access_block" "service_storage_acl" {
  bucket = aws_s3_bucket.service_storage.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


resource "aws_s3_bucket_server_side_encryption_configuration" "service_storage_s3_kms" {
  bucket = aws_s3_bucket.service_storage.id

  rule {
    bucket_key_enabled = true
  }
}

# s3 access logs
resource "aws_s3_bucket" "s3_access_logs" {
  bucket        = "${var.project_name}-${var.environment}-s3-access-logs"
  force_destroy = var.force_destroy

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-s3-access-logs"
    }
  )
}

resource "aws_s3_bucket_server_side_encryption_configuration" "access_log_s3_kms" {
  bucket = aws_s3_bucket.s3_access_logs.id

  rule {
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_policy" "access_log_policy" {
  bucket = aws_s3_bucket.s3_access_logs.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Id" : "S3AccessLogPolicy",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "logging.s3.amazonaws.com"
        },
        "Action" : "s3:PutObject",
        "Resource" : "${aws_s3_bucket.s3_access_logs.arn}/*"
      }
    ]
  })
}