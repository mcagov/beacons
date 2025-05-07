resource "aws_elasticache_subnet_group" "main" {
  name       = "${terraform.workspace}-mca-beacons-elasticache-subnet-group"
  subnet_ids = aws_subnet.app.*.id
}

resource "aws_security_group" "elasticache" {
  name        = "${terraform.workspace}-mca-beacons-elasticache-security-group"
  description = "Allows inbound access from the task only"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = var.redis_port
    to_port         = var.redis_port
    security_groups = aws_security_group.ecs_tasks[*].id
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${terraform.workspace}-mca-beacons-elasticache-cluster"
  engine               = "redis"
  node_type            = "cache.t2.small"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  engine_version       = "6.x"
  port                 = var.redis_port
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.elasticache.id]
}
