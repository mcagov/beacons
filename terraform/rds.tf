resource "aws_db_instance" "postgres" {
  identifier                      = "${var.env}-beacons-database"
  allocated_storage               = var.db_storage
  engine                          = "postgres"
  engine_version                  = "13.1"
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
}
