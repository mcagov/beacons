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

resource "aws_secretsmanager_secret" "opensearch_master_user_name" {
  name = "${terraform.workspace}_opensearch_master_user_name"
}

resource "aws_secretsmanager_secret_version" "opensearch_master_user_name" {
  secret_id     = aws_secretsmanager_secret.opensearch_master_user_name.id
  secret_string = var.opensearch_master_user_name
}

resource "aws_secretsmanager_secret" "opensearch_master_password" {
  name = "${terraform.workspace}_opensearch_master_password"
}

resource "aws_secretsmanager_secret_version" "opensearch_master_password" {
  secret_id     = aws_secretsmanager_secret.opensearch_master_password.id
  secret_string = var.opensearch_master_user_password
}

resource "aws_secretsmanager_secret" "opensearch_application_user_name" {
  name = "${terraform.workspace}_os_application_user_name"
}

resource "random_string" "opensearch_application_username" {
  length = 8
}

resource "aws_secretsmanager_secret_version" "opensearch_application_user_name" {
  secret_id     = aws_secretsmanager_secret.opensearch_application_user_name.id
  secret_string = random_string.opensearch_application_username.result
}

resource "aws_secretsmanager_secret" "opensearch_application_password" {
  name = "${terraform.workspace}_os_application_password"
}

resource "random_password" "opensearch_application_password" {
  length = 32
}

resource "aws_secretsmanager_secret_version" "opensearch_application_password" {
  secret_id     = aws_secretsmanager_secret.opensearch_application_password.id
  secret_string = random_password.opensearch_application_password.result
}

resource "aws_secretsmanager_secret" "opensearch_application_credentials_base64" {
  name = "${terraform.workspace}_os_creds_base64"
}

resource "aws_secretsmanager_secret_version" "opensearch_application_credentials_base64" {
  secret_id     = aws_secretsmanager_secret.opensearch_application_credentials_base64.id
  secret_string = base64encode("${random_string.opensearch_application_username.result}:${random_password.opensearch_application_password.result}")
}

