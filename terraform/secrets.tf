resource "aws_secretsmanager_secret" "db_password" {
  name = "${terraform.workspace}_db_password"
  tags = module.beacons_label.tags
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.db_password
}

resource "aws_secretsmanager_secret" "gov_notify_api_key" {
  name = "${terraform.workspace}_gov_notify_api_key"
  tags = module.beacons_label.tags
}

resource "aws_secretsmanager_secret_version" "gov_notify_api_key" {
  secret_id     = aws_secretsmanager_secret.gov_notify_api_key.id
  secret_string = var.gov_notify_api_key
}

resource "aws_secretsmanager_secret" "gov_notify_customer_email_template" {
  name = "${terraform.workspace}_gov_notify_customer_email_template"
  tags = module.beacons_label.tags
}

resource "aws_secretsmanager_secret_version" "gov_notify_customer_email_template" {
  secret_id     = aws_secretsmanager_secret.gov_notify_customer_email_template.id
  secret_string = var.gov_notify_customer_email_template
}

resource "aws_secretsmanager_secret" "basic_auth" {
  name = "${terraform.workspace}_basic_auth"
}

resource "aws_secretsmanager_secret_version" "basic_auth" {
  secret_id     = aws_secretsmanager_secret.basic_auth.id
  secret_string = var.basic_auth
}