resource "aws_alb" "main" {
  name            = "${terraform.workspace}-beacons"
  subnets         = aws_subnet.public.*.id
  security_groups = [aws_security_group.lb.id]

  access_logs {
    bucket  = aws_s3_bucket.logs.bucket
    prefix  = "load_balancer"
    enabled = true
  }
}

resource "aws_alb_listener" "front_end" {
  load_balancer_arn = aws_alb.main.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener_rule" "front_end" {
  count        = terraform.workspace == "production" ? 0 : 1
  listener_arn = aws_alb_listener.front_end_ssl.arn

  action {
    type = "authenticate-oidc"

    authenticate_oidc {
      authorization_endpoint     = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/authorize"
      client_id                  = var.opensearch_proxy_sso_client_id
      client_secret              = var.opensearch_proxy_sso_client_secret
      issuer                     = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/v2.0"
      token_endpoint             = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/token"
      user_info_endpoint         = "https://graph.microsoft.com/oidc/userinfo"
      on_unauthenticated_request = "authenticate"
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.webapp.id
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

resource "aws_alb_listener" "front_end_ssl" {
  load_balancer_arn = aws_alb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-FS-1-2-2019-08"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    target_group_arn = aws_alb_target_group.webapp.id
    type             = "forward"
  }
}

resource "aws_lb_listener_rule" "service" {
  listener_arn = aws_alb_listener.front_end_ssl.arn

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.service.arn
  }

  condition {
    path_pattern {
      values = ["/spring-api/*"]
    }
  }
}

resource "aws_alb_target_group" "backoffice" {
  name                 = "${terraform.workspace}-backoffice-tg"
  port                 = var.backoffice_port
  protocol             = "HTTP"
  vpc_id               = aws_vpc.main.id
  target_type          = "ip"
  deregistration_delay = 60

  health_check {
    healthy_threshold   = "6"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "10"
    path                = var.backoffice_health_check_path
    unhealthy_threshold = "6"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener_rule" "backoffice" {
  listener_arn = aws_alb_listener.front_end_ssl.arn

  action {
    type = "authenticate-oidc"

    authenticate_oidc {
      authorization_endpoint     = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/authorize"
      client_id                  = var.opensearch_proxy_sso_client_id
      client_secret              = var.opensearch_proxy_sso_client_secret
      issuer                     = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/v2.0"
      token_endpoint             = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/token"
      user_info_endpoint         = "https://graph.microsoft.com/oidc/userinfo"
      on_unauthenticated_request = "authenticate"
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.backoffice.arn
  }

  condition {
    path_pattern {
      values = ["/backoffice*"]
    }
  }
}

/**
* Forward traffic from the public Internet to a proxy for the OpenSearch service
*
* This allow the OpenSearch service to exist within the VPC, and for authentication rules to be applied at the
* boundary with the public Internet.
*
* We do not want to give the public Internet unrestricted access to the OpenSearch service as it contains sensitive
* data.
*/
resource "aws_lb_listener_rule" "opensearch_search_proxy" {
  listener_arn = aws_alb_listener.front_end_ssl.arn

  /**
  * Require users to authenticate.  Prevent all unauthenticated traffic from reaching the OpenSearch Proxy.
  */
  action {
    type = "authenticate-oidc"

    authenticate_oidc {
      authorization_endpoint     = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/authorize"
      client_id                  = var.opensearch_proxy_sso_client_id
      client_secret              = var.opensearch_proxy_sso_client_secret
      issuer                     = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/v2.0"
      token_endpoint             = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/token"
      user_info_endpoint         = "https://graph.microsoft.com/oidc/userinfo"
      on_unauthenticated_request = "deny"
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.opensearch_proxy.arn
  }

  condition {
    path_pattern {
      values = ["/api/search*"]
    }
  }
}

/**
* Identical rule to opensearch_search_proxy, but on the search.* subdomain to allow OpenSearch Dashboards a clean path
*/
resource "aws_lb_listener_rule" "opensearch_dashboards_proxy" {
  listener_arn = aws_alb_listener.front_end_ssl.arn

  action {
    type = "authenticate-oidc"

    authenticate_oidc {
      authorization_endpoint = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/authorize"
      client_id              = var.opensearch_proxy_sso_client_id
      client_secret          = var.opensearch_proxy_sso_client_secret
      issuer                 = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/v2.0"
      token_endpoint         = "https://login.microsoftonline.com/${var.azure_ad_tenant_id}/oauth2/v2.0/token"
      user_info_endpoint     = "https://graph.microsoft.com/oidc/userinfo"
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.opensearch_proxy.arn
  }

  condition {
    host_header {
      values = ["search.*"]
    }
  }
}

resource "aws_alb_target_group" "opensearch_proxy" {
  name                 = "${terraform.workspace}-opensearch-proxy-tg"
  port                 = 80
  protocol             = "HTTP"
  vpc_id               = aws_vpc.main.id
  target_type          = "ip"
  deregistration_delay = 60

  lifecycle {
    create_before_destroy = true
  }

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = "/health"
    unhealthy_threshold = "2"
  }
}

resource "aws_alb_target_group" "webapp" {
  name                 = "${terraform.workspace}-webapp-target-group"
  port                 = var.webapp_port
  protocol             = "HTTP"
  vpc_id               = aws_vpc.main.id
  target_type          = "ip"
  deregistration_delay = 60

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = var.webapp_health_check_path
    unhealthy_threshold = "2"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_alb_target_group" "service" {
  name                 = "${terraform.workspace}-service-target-group"
  port                 = var.service_port
  protocol             = "HTTP"
  vpc_id               = aws_vpc.main.id
  target_type          = "ip"
  deregistration_delay = 60

  health_check {
    healthy_threshold   = "6"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "10"
    path                = var.service_health_check_path
    unhealthy_threshold = "6"
  }

  lifecycle {
    create_before_destroy = true
  }
}

