resource "aws_route53_zone" "domain" {
  name = local.domain_name
  tags = merge(
    local.tags,
    {
      "Name" = "${var.project_name}.${var.domain_name}-route53-domain"
    }
  )
}

output "domain_name" {
  value = aws_route53_zone.domain.name
}

output "domain_name_servers" {
  value = aws_route53_zone.domain.name_servers
}


resource "aws_route53_record" "test" {
  zone_id = aws_route53_zone.domain.zone_id
  name    = "test-name"
  type    = "CNAME"
  ttl     = "300"
  records = [
    random_integer.random_subnet_index.result == 0 ? "www.nate.com" :
    random_integer.random_subnet_index.result == 1 ? "www.cyworld.com" : "www.example.com"
  ]
}


# admin api dns
resource "aws_route53_record" "admin_api" {
  zone_id = aws_route53_zone.domain.zone_id
  name    = "${var.environment}-admin-api"
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_lb.admin_api.dns_name
    zone_id                = aws_lb.admin_api.zone_id
  }
}

output "admin_api_dns_name" {
  value = aws_route53_record.admin_api.fqdn
}

# admin web dns
resource "aws_route53_record" "admin_web" {
  zone_id = aws_route53_zone.domain.zone_id
  name    = "${var.environment}-admin-web"
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_lb.admin_web.dns_name
    zone_id                = aws_lb.admin_web.zone_id
  }

}

output "admin_web_dns_name" {
  value = aws_route53_record.admin_web.fqdn
}

# player api dns
resource "aws_route53_record" "player_api" {
  zone_id = aws_route53_zone.domain.zone_id
  name    = "${var.environment}-player-api"
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_lb.player_api.dns_name
    zone_id                = aws_lb.player_api.zone_id
  }
}

output "player_api_dns_name" {
  value = aws_route53_record.player_api.fqdn
}

# seller api dns
resource "aws_route53_record" "seller_api" {
  zone_id = aws_route53_zone.domain.zone_id
  name    = "${var.environment}-seller-api"
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_lb.seller_api.dns_name
    zone_id                = aws_lb.seller_api.zone_id
  }
}

output "seller_api_dns_name" {
  value = aws_route53_record.seller_api.fqdn
}

# game server api dns
resource "aws_route53_record" "game_server_api" {
  zone_id = aws_route53_zone.domain.zone_id
  name    = "${var.environment}-internal-game-server-api"
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_lb.ecs_internal_game_server.dns_name
    zone_id                = aws_lb.ecs_internal_game_server.zone_id
  }
}

output "game_server_api_dns_name" {
  value = aws_route53_record.game_server_api.fqdn
}