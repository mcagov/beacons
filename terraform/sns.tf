resource "aws_sns_topic" "sns_alerts" {
  name = var.sns_alerts_name
}

resource "aws_sns_topic_policy" "sns_alerts_policy" {
  arn = aws_sns_topic.sns_alerts.arn
  policy = data.aws_iam_policy_document.sns_policy_document.json
}

data "aws_iam_policy_document" "sns_policy_document" {
  policy_id = "__default_policy_ID"

  statement {
    actions = [
      "SNS:Subscribe",
      "SNS:SetTopicAttributes",
      "SNS:RemovePermission",
      "SNS:Receive",
      "SNS:Publish",
      "SNS:ListSubscriptionsByTopic",
      "SNS:GetTopicAttributes",
      "SNS:DeleteTopic",
      "SNS:AddPermission",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceOwner"

      values = [
        "232705206979",
      ]
    }

    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      aws_sns_topic.sns_alerts.arn,
    ]

    sid = "__default_statement_ID"
  }
}

resource "aws_sns_topic_subscription" "sns_alerts_subscription" {
  topic_arn = aws_sns_topic.sns_alerts.arn
  protocol  = "email"
  endpoint  = "stephen.strudwick@madetech.com"
}
