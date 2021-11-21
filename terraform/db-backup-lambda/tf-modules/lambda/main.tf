variable "s3_lambda_layer_store" {} # to get the name use s3_bucket_id
variable "s3_snapshots_bucket" {} # to get name use s3_bucket_id
variable "s3_csv_bucket" {} # to get name use s3_bucket_id
variable "transform_lambda_role" {}
variable "export_lambda_role" {}
variable "accountId" {}
variable "kmsKeyId" {}
variable "region" {}
variable "name" {}

# The lambda layer
module "lambda_layer_s3" {
  source = "terraform-aws-modules/lambda/aws"

  create_layer = true

  layer_name    = "parquet-to-csv-layer"
  description   = "s3/ parquet-lite/ csv-writer layer (deployed from s3)"
  artifacts_dir = "build"

  compatible_runtimes = ["nodejs14.x"]

  source_path = [{ path = "${path.root}/node_modules", commands = [], patterns = ["node_modules/.+"], prefix_in_zip = "nodejs/node_modules" }]

  attach_policy_json = true
  policy_json        = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowLambdaToGet",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}/*",
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}"
      ],
     "Principal": {
          "AWS": [
            "${var.transform_lambda_role.arn}"
          ]
      }
    }
  ]
}
EOF

  store_on_s3 = true
  s3_bucket   = var.s3_lambda_layer_store.s3_bucket_id

  depends_on = [var.s3_lambda_layer_store]
}

# The cron lambda function
module "lambda_function_db_snapshot_cron" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "cron-db-snapshot-${var.name}"
  description   = "beacons cron db snapshot"
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  lambda_role   = var.export_lambda_role.arn

  artifacts_dir = "cron_build"

  layers      = [module.lambda_layer_s3.lambda_layer_arn]
  source_path = fileset(path.root, "cron_build/*.js")

  timeout            = 900
  attach_policy_json = true
  policy_json        = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowLambdaPassRole",
      "Action": [
        "iam:PassRole",
        "iam:GetRole"
      ],
      "Effect": "Allow",
      "Resource": [
        "${var.export_lambda_role.arn}"
      ]
    },
    {
      "Sid": "AllowLambdaToCreateDBSnapshot",
      "Action": [
        "rds:CreateDBSnapshot",
        "rds:DescribeDBSnapshots",
        "rds:StartExportTask"
        ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:rds:${var.region}:${var.accountId}:db:dev-beacons-database",
        "arn:aws:rds:${var.region}:${var.accountId}:snapshot:*",
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}/*",
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}"
      ]
    },
    {
      "Sid": "AllowLambdaToExportSnapshotToS3",
      "Action": [
        "rds:StartExportTask",
        "kms:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "*"
      ]
    },
    {
      "Sid": "AllowLambdaToPut",
      "Action": [
        "s3:PutObject"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}/*"
      ]
    },
    {
      "Sid": "AllowLambdaToGetParquetSnapshot",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}/*",
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}"
      ]
    },
    {
      "Sid": "AllowLambdaToGetNodeModules",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.s3_lambda_layer_store.s3_bucket_id}/*"
      ]
    }
  ]
}
EOF

  environment_variables = {
    KMS_KEY_ID      = var.kmsKeyId,
    IAM_ROLE_ARN    = var.export_lambda_role.arn,
    REGION          = var.region,
    SNAPSHOT_BUCKET = var.s3_snapshots_bucket.s3_bucket_id
  }

  tags = {
    Name = "beacons-integration"
  }

  depends_on = [
    module.lambda_layer_s3,
    var.transform_lambda_role,
    var.export_lambda_role,
    var.s3_snapshots_bucket
  ]
}


# The transform function
module "lambda_function_parquet_to_csv" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "db-backup-${var.name}"
  description   = "beacons db backup to human-readable .csv"
  handler       = "index.handler"
  runtime       = "nodejs14.x"

  lambda_role = var.transform_lambda_role.arn

  artifacts_dir = "build"

  layers      = [module.lambda_layer_s3.lambda_layer_arn]
  source_path = fileset(path.root, "build/*.js")

  timeout            = 300
  attach_policy_json = true
  policy_json        = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowLambdaToPut",
      "Action": [
        "s3:PutObject"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.s3_csv_bucket.s3_bucket_id}/*"
      ]
    },
    {
      "Sid": "AllowLambdaToGetAndList",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.s3_csv_bucket.s3_bucket_id}",
        "arn:aws:s3:::${var.s3_csv_bucket.s3_bucket_id}/*",
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}",
        "arn:aws:s3:::${var.s3_snapshots_bucket.s3_bucket_id}/*"
      ]
    },
   {
      "Sid": "AllowLambdaToGetNodeModules",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.s3_lambda_layer_store.s3_bucket_id}/*"
      ]
    },
   {
      "Sid": "AllowLambdaToDecrypt",
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:kms:${var.region}:${var.accountId}:key/${var.kmsKeyId}"
      ]
    }
  ]
}
EOF

  environment_variables = {
    REGION          = var.region,
    SNAPSHOT_BUCKET = var.s3_snapshots_bucket.s3_bucket_id
    DEST_BUCKET     = var.s3_csv_bucket.s3_bucket_id
  }

  tags = {
    Name = "beacons-integration"
  }

  depends_on = [
    module.lambda_layer_s3,
    var.transform_lambda_role
  ]
}

