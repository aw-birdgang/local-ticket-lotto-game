resource "aws_subnet" "public_subnets" {
  count                                       = length(data.aws_availability_zones.available_az.zone_ids)
  vpc_id                                      = aws_vpc.lotto-lanka.id
  availability_zone_id                        = data.aws_availability_zones.available_az.zone_ids[count.index]
  cidr_block                                  = cidrsubnet(aws_vpc.lotto-lanka.cidr_block, 4, count.index)
  map_public_ip_on_launch                     = true
  enable_resource_name_dns_a_record_on_launch = true
  private_dns_hostname_type_on_launch         = "resource-name"
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-subnet-public${count.index + 1}-${data.aws_availability_zones.available_az.names[count.index]}"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}

resource "aws_subnet" "private_subnets" {
  count                                       = length(data.aws_availability_zones.available_az.zone_ids)
  vpc_id                                      = aws_vpc.lotto-lanka.id
  availability_zone_id                        = data.aws_availability_zones.available_az.zone_ids[count.index]
  cidr_block                                  = cidrsubnet(aws_vpc.lotto-lanka.cidr_block, 4, count.index + 8)
  map_public_ip_on_launch                     = false
  enable_resource_name_dns_a_record_on_launch = true
  private_dns_hostname_type_on_launch         = "resource-name"
  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-subnet-private${count.index + 1}-${data.aws_availability_zones.available_az.names[count.index]}"
    }
  )
  lifecycle {
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}