resource "aws_db_instance" "postgres" {
  tags                            = module.beacons_label.tags
  identifier                      = "${terraform.workspace}-beacons-database"
  allocated_storage               = var.db_storage
  engine                          = "postgres"
  engine_version                  = "12.5"
  db_subnet_group_name            = aws_db_subnet_group.db.id
  vpc_security_group_ids          = [aws_security_group.db.id]
  deletion_protection             = var.db_delete_protection
  name                            = var.db_name
  username                        = var.db_username
  password                        = var.db_password
  instance_class                  = var.db_instance_class
  storage_encrypted               = var.db_storage_encrypted
  skip_final_snapshot             = var.db_skip_final_snapshot
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  allow_major_version_upgrade     = true
  backup_window                   = "23:00-23:55"
  backup_retention_period         = 30
  performance_insights_enabled    = true
  apply_immediately               = true
  multi_az                        = true
}

module "aws-rds-alarms" {
  source            = "lorenzoaiello/rds-alarms/aws"
  version           = "2.1.0"
  db_instance_id    = aws_db_instance.postgres.id
  db_instance_class = "db.t2.micro"
}
