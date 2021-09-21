# ALB Security Group: Edit to restrict access to the application
resource "aws_security_group" "lb" {
  name        = "${terraform.workspace}-beacons-load-balancer-security-group"
  description = "Allows inbound traffic to the ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Traffic to the ECS cluster should only come from the ALB
// TODO: Separate ecs_tasks into a single security group for each of Webapp, API
resource "aws_security_group" "ecs_tasks" {
  name        = "${terraform.workspace}-beacons-ecs-tasks-security-group"
  description = "Allows inbound access from the ALB only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow inbound traffic from load balancer to the webapp"
    protocol        = "tcp"
    from_port       = var.webapp_port
    to_port         = var.webapp_port
    security_groups = [aws_security_group.lb.id]
  }

  ingress {
    description     = "Allow inbound traffic from load balancer to the API"
    protocol        = "tcp"
    from_port       = var.service_port
    to_port         = var.service_port
    security_groups = [aws_security_group.lb.id]
  }

  ingress {
    description = "Allow inbound traffic from the webapp to the API"
    protocol    = "tcp"
    from_port   = var.service_port
    to_port     = var.service_port
    self        = true
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db" {
  name        = "${terraform.workspace}-beacons-rds-security-group"
  description = "Allows inbound access from the ECS tasks only"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    security_groups = aws_security_group.ecs_tasks[*].id
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Allows traffic from the ECS cluster to VPC endpoints for ECR images
resource "aws_security_group" "vpc_endpoints" {
  name        = "${terraform.workspace}-beacons-ecr-vpc-endpoints-security-group"
  description = "Allows inbound access from the ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    security_groups = aws_security_group.ecs_tasks[*].id
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}
