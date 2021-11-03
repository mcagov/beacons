variable "name" {}
variable "transform_lambda" {}
variable "cron_lambda" {}
variable "snapshots_bucket" {}

resource "aws_cloudwatch_event_rule" "daily" {
  name                = "daily"
  description         = "Fires every day at 1am"
  schedule_expression = "cron(0 1 * * ? *)"
}

resource "aws_cloudwatch_event_target" "backup_rds_to_snapshot" {
  rule      = aws_cloudwatch_event_rule.daily.name
  target_id = "lambda"
  arn       = var.cron_lambda.lambda_function_arn
  depends_on = [
    var.cron_lambda
  ]
}

# Trigger transforming lambda
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = var.snapshots_bucket.s3_bucket_id

  lambda_function {
    id                  = "lambda_fn_bucket_notification_${var.name}"
    lambda_function_arn = var.transform_lambda.lambda_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = "_SUCCESS"
  }

  depends_on = [aws_lambda_permission.allow_bucket, var.snapshots_bucket]
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = var.transform_lambda.lambda_function_name
  principal     = "s3.amazonaws.com"
  source_arn    = var.snapshots_bucket.s3_bucket_arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda_cron" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = var.cron_lambda.lambda_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily.arn
}

