resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "notify_trello_lambda" {
  filename      = "trello-lambda/src/trello-lambda.zip"
  function_name = "notify-trello"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"

  source_code_hash = filebase64sha256("trello-lambda/src/trello-lambda.zip")

  runtime = "nodejs12.x"

  environment {
    variables = {
      trelloToken  = var.trello_token
      trelloApiKey = var.trello_api_key
      trelloListId = var.trello_list_id
    }
  }
}

resource "aws_lambda_permission" "with_sns_technical_alerts" {
  statement_id  = "AllowExecutionFromSNSTechnicalAlerts"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notify_trello_lambda.arn
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.sns_technical_alerts.arn
}

resource "aws_lambda_permission" "with_sns_service_alerts" {
  statement_id  = "AllowExecutionFromSNSServiceAlerts"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notify_trello_lambda.arn
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.sns_service_alerts.arn
}

resource "aws_sns_topic_subscription" "sns_technical_alerts_lambda_subscription" {
  topic_arn = aws_sns_topic.sns_technical_alerts.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notify_trello_lambda.arn
}

resource "aws_sns_topic_subscription" "sns_service_alerts_lambda_subscription" {
  topic_arn = aws_sns_topic.sns_service_alerts.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notify_trello_lambda.arn
}
