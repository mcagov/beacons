# Infrastructure-as-code

The terraform files within this directory represents the infrastructure-as-code for the Beacons Maintenance Page.

## Required Setup
Before the pipeline can be triggered to deploy to AWS, the following setup is required:

- [S3 bucket](https://www.terraform.io/docs/language/settings/backends/s3.html) configured. Bucket key needs to match that in [main.tf](./main.tf)
- Dynamo DB table configured. See [Terraform docs](https://www.terraform.io/docs/language/settings/backends/s3.html#dynamodb-state-locking)
- Ensure that the terraform workspaces for all environments exist
    - `terraform workspace new ${env_name}` where env_name is `dev`, `staging` or `production`
    -  `terraform workspace list` allows you to view existing workspaces
