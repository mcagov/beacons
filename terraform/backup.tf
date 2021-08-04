resource "aws_db_snapshot" "latest_snapshot" {
  db_instance_identifier = aws_db_instance.postgres.id
  db_snapshot_identifier = "${terraform.workspace}-latest"
}
