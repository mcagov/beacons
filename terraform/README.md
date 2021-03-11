# Infrastructure-as-code

The terraform files within this directory represents the infratsructure-as-code for the Beacons Registration Project.

## Required Setup

Before the pipeline can be trigger to deploy to AWS, the following setup is required:

- [S3 bucket](https://www.terraform.io/docs/language/settings/backends/s3.html) configured. Bucket key needs to match that in [provider.tf](./provider.tf)
- Dynamo DB table configured. See [Terraform docs](https://www.terraform.io/docs/language/settings/backends/s3.html#dynamodb-state-locking)
- ECR for the docker images of the webapp and service
- Ensure that the terraform workspaces for all environments exist
  - `terraform workspace new ${env_name}` where env_name is `dev`, `staging` or `prod`
  -  `terraform workspace list` allows you to view existing workspaces
