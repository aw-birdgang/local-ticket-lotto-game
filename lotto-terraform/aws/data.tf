provider "random" {}

data "aws_availability_zones" "available_az" {
  state = "available"
}

resource "random_integer" "random_subnet_index" {
  min = 0
  max = length(aws_subnet.public_subnets) - 1
}
