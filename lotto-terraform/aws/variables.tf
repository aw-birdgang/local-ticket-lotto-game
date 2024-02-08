# project setting
variable "project_name" {
  description = "lanka lotto project"
  type        = string
  default     = "lotto-lanka"
}

variable "environment" {
  description = "development environment"
  type        = string
  default     = "dev"
}

# aws config
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "aws_profile" {
  description = "for running terraform aws profile"
  type        = string
}

# rds config
variable "rds_pwd" {
  description = "password for rds"
  type        = string
  default     = "sT,S(FK;m5e.T.17"
}

# route53
variable "domain_name" {
  description = "service domain name"
  type        = string
  default     = "gpexdev.com"
}

# s3 config
variable "force_destroy" {
  description = "force destroy for testing. When product deployment, it should be false"
  type        = bool
  default     = true
}