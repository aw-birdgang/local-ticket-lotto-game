resource "aws_vpc" "lotto-lanka" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}