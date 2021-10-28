resource "aws_alb" "main" {
  name            = "${terraform.workspace}-beacons"
  subnets         = aws_subnet.public.*.id
  security_groups = [aws_security_group.lb.id]
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

resource "aws_alb_listener" "front_end_ssl" {
  load_balancer_arn = aws_alb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:eu-west-2:232705206979:certificate/b75eecc6-fff7-4114-b100-b1f0eb0641d7"

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

resource "aws_lb_listener_rule" "backoffice_spa" {
  listener_arn = aws_alb_listener.front_end_ssl.arn

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.service.arn
  }

  condition {
    path_pattern {
      values = ["/backoffice/*"]
    }
  }
}

resource "aws_alb_target_group" "webapp" {
  name        = "${terraform.workspace}-webapp-target-group"
  port        = var.webapp_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

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
  name        = "${terraform.workspace}-service-target-group"
  port        = var.service_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

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
