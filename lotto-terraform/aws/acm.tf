resource "aws_acm_certificate" "cert" {
  domain_name       = "*.${local.domain_name}"
  validation_method = "DNS"

  tags = merge(
    local.tags,
    {
      Name = "${var.project_name}-${var.environment}-acm"
    }
  )

  lifecycle {
    create_before_destroy = true
    ignore_changes = [
      tags["Created_date_time_utc"],
      tags["Created_date_time_kst"]
    ]
  }
}

resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.domain.zone_id
}