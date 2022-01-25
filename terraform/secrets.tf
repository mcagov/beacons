resource "aws_secretsmanager_secret" "db_password" {
  name = "${terraform.workspace}_db_password"
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.db_password
}

resource "aws_secretsmanager_secret" "gov_notify_api_key" {
  name = "${terraform.workspace}_gov_notify_api_key"
}

resource "aws_secretsmanager_secret_version" "gov_notify_api_key" {
  secret_id     = aws_secretsmanager_secret.gov_notify_api_key.id
  secret_string = var.gov_notify_api_key
}

resource "aws_secretsmanager_secret" "webapp_client_secret" {
  name = "${terraform.workspace}_webapp_client_secret"
}

resource "aws_secretsmanager_secret_version" "webapp_client_secret" {
  secret_id     = aws_secretsmanager_secret.webapp_client_secret.id
  secret_string = var.webapp_azure_ad_client_secret
}

resource "aws_secretsmanager_secret" "webapp_b2c_client_secret" {
  name = "${terraform.workspace}_b2c_client_secret"
}

resource "aws_secretsmanager_secret_version" "webapp_b2c_client_secret" {
  secret_id     = aws_secretsmanager_secret.webapp_b2c_client_secret.id
  secret_string = var.webapp_azure_b2c_client_secret
}

resource "aws_secretsmanager_secret" "webapp_b2c_next_auth_jwt_secret" {
  name = "${terraform.workspace}_b2c_next_auth_jwt_secret"
}

resource "aws_secretsmanager_secret_version" "webapp_b2c_next_auth_jwt_secret" {
  secret_id     = aws_secretsmanager_secret.webapp_b2c_next_auth_jwt_secret.id
  secret_string = var.webapp_azure_b2c_next_auth_jwt_secret
}

resource "aws_secretsmanager_secret" "opensearch_master_password" {
  name = "${terraform.workspace}_opensearch_master_password"
}

resource "aws_secretsmanager_secret_version" "opensearch_master_password" {
  secret_id     = aws_secretsmanager_secret.opensearch_master_password.id
  secret_string = var.opensearch_master_user_password
}