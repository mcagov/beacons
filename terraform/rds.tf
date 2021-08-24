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
  backup_window                   = var.backup_window
  backup_retention_period         = var.backup_retention_period
  copy_tags_to_snapshot           = true
  performance_insights_enabled    = var.performance_insights_enabled
  apply_immediately               = var.apply_immediately
  multi_az                        = var.multi_az
}

module "aws-rds-alarms" {
  source            = "lorenzoaiello/rds-alarms/aws"
  version           = "2.1.0"
  db_instance_id    = aws_db_instance.postgres.id
  db_instance_class = "db.t2.micro"
  actions_alarm     = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
  actions_ok        = var.enable_alerts == true ? [aws_sns_topic.sns_technical_alerts.arn] : []
}
