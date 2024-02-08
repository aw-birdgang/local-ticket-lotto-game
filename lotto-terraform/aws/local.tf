data "aws_caller_identity" "current" {}

locals {
  tags = {
    "Environment"           = var.environment
    "Project"               = var.project_name
    "Created_id"            = data.aws_caller_identity.current.id
    "Created_account_id"    = data.aws_caller_identity.current.account_id
    "Created_user_id"       = data.aws_caller_identity.current.user_id
    "Created_user_arn"      = data.aws_caller_identity.current.arn
    "Create_by"             = "Terraform"
    "Created_date_time_utc" = formatdate("YYYY-MM-DD hh:mm:ss ZZZ", timestamp())
    "Created_date_time_kst" = formatdate("YYYY-MM-DD hh:mm:ss+09:00", timeadd(timestamp(), "9h"))
  }
  domain_name = "${var.project_name}.${var.domain_name}"
}