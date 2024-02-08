resource "aws_ecr_repository" "lotto-lanka-game-server" {
  name         = "lotto-lanka-game-server"
  force_delete = var.force_destroy
}

resource "aws_ecr_repository" "lotto-lanka-player-api" {
  name         = "lotto-lanka-player-api"
  force_delete = var.force_destroy
}

resource "aws_ecr_repository" "lotto-lanka-seller-api" {
  name         = "lotto-lanka-seller-api"
  force_delete = var.force_destroy
}

resource "aws_ecr_repository" "lotto-lanka-admin-web" {
  name         = "lotto-lanka-admin-web"
  force_delete = var.force_destroy
}

resource "aws_ecr_repository" "lotto-lanka-admin-api" {
  name         = "lotto-lanka-admin-api"
  force_delete = var.force_destroy
}

resource "aws_ecr_repository" "lotto-lanka-batch" {
  name         = "lotto-lanka-batch"
  force_delete = var.force_destroy
}