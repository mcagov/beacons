# Infrastructure-as-code

The terraform files within this directory represents the infratsructure-as-code for the Beacons Registration Project.

## Required Setup

Before the pipeline can be trigger to deploy to AWS, the following setup is required:

- [S3 bucket](https://www.terraform.io/docs/language/settings/backends/s3.html) configured. Bucket key needs to match that in [provider.tf](./provider.tf)
- Dynamo DB table configured. see [Terraform docs](https://www.terraform.io/docs/language/settings/backends/s3.html#dynamodb-state-locking)
