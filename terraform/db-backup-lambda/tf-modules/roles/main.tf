variable "name" {}
variable "snapshots_arn" {}

# The role for the lambda to push to the output s3
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda_${var.name}"

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
      "Sid": "assumeLambdaRole"
    }
  ]
}
EOF
}

# The role for the lambda to push to the output s3
resource "aws_iam_role" "iam_for_export" {
  name = "iam_for_export_${var.name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": "assumeS3Role"
    },
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "rds.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": "assumeRdsRole"
    },
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "export.rds.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": "assumeExportRdsRole"
    }
  ]
}
EOF

  managed_policy_arns = [aws_iam_policy.export_snapshots.arn]
}

resource "aws_iam_policy" "export_snapshots" {
  name = "export-snapshots-${var.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
            "Sid": "ExportPolicy",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject*",
                "s3:ListBucket",
                "s3:GetObject*",
                "s3:DeleteObject*",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "${var.snapshots_arn}",
                "${var.snapshots_arn}/*"
            ]
        },
    {
            "Sid": "ExportPolicyStartTask",
            "Effect": "Allow",
            "Action": [
              "rds:StartExportTask"
            ],
            "Resource": [
              "*"
            ]
        }
  ]
}
EOF
}

