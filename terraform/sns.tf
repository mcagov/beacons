resource "aws_sns_topic" "sns_technical_alerts" {
  name = "beacons-technical-alerts"
}

resource "aws_sns_topic" "sns_service_alerts" {
  name     = "beacons-service-alerts"
  provider = aws.us-east
}

resource "aws_sns_topic_policy" "sns_technical_alerts_policy" {
  arn    = aws_sns_topic.sns_technical_alerts.arn
  policy = data.aws_iam_policy_document.sns_technical_alerts_policy_document.json
}

resource "aws_sns_topic_policy" "sns_service_alerts_policy" {
  arn      = aws_sns_topic.sns_service_alerts.arn
  policy   = data.aws_iam_policy_document.sns_service_alerts_policy_document.json
  provider = aws.us-east
}

resource "aws_sns_topic_subscription" "sns_technical_alerts_subscription" {
  topic_arn = aws_sns_topic.sns_technical_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email_address
}

resource "aws_sns_topic_subscription" "sns_service_alerts_subscription" {
  topic_arn = aws_sns_topic.sns_service_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email_address
  provider  = aws.us-east
}

data "aws_iam_policy_document" "sns_technical_alerts_policy_document" {
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
        var.aws_account_number,
      ]
    }

    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      aws_sns_topic.sns_technical_alerts.arn
    ]

    sid = "__default_statement_ID"
  }
}

data "aws_iam_policy_document" "sns_service_alerts_policy_document" {
  policy_id = "__default_policy_ID"
  provider  = aws.us-east

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
        var.aws_account_number,
      ]
    }

    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      aws_sns_topic.sns_service_alerts.arn
    ]

    sid = "__default_statement_ID"
  }
}
