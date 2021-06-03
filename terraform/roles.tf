data "aws_iam_policy_document" "ecs_task_execution_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${terraform.workspace}-ecs-execution-role"
  tags               = module.beacons_label.tags
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_policy" "secret_manager_access" {
  name   = "${terraform.workspace}-secret-manager-access"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "kms:Decrypt"
      ],
      "Resource": [
        "${aws_secretsmanager_secret.db_password.arn}",
        "${aws_secretsmanager_secret.gov_notify_api_key.arn}",
        "${aws_secretsmanager_secret.gov_notify_customer_email_template.arn}",
        "${aws_secretsmanager_secret.basic_auth.arn}",
        "${aws_secretsmanager_secret.webapp_client_secret.arn}"
        "${aws_secretsmanager_secret.webapp_b2c_client_secret.arn}"
        "${aws_secretsmanager_secret.webapp_b2c_next_auth_jwt_secret.arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "secret_manager_access" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.secret_manager_access.arn
}