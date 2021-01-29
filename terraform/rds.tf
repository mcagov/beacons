resource "aws_db_instance" "postgres" {
  allocated_storage      = var.db_storage
  engine                 = "postgres"
  engine_version         = "12.5"
  db_subnet_group_name   = aws_db_subnet_group.db.id
  vpc_security_group_ids = [aws_security_group.db.id]
  deletion_protection    = var.db_delete_protection
  name                   = var.db_name
  username               = var.db_username
  password               = var.db_password
  instance_class         = var.db_instance_class
  storage_encrypted      = var.db_storage_encrypted
}
