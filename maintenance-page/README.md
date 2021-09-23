# Infrastructure-as-code

The terraform files within this directory represents the infrastructure-as-code for the Beacons Maintenance Page.

The basic premise is a static https enabled page served via CloudFront and S3 that can be swapped via the route53 alias functionality.

You can build a maintenance page for any environment or URL although the default settings tie together the environment and the urls currently in use.

e.g the staging environment uses the url staging.406beacons.com.

Note: the s3 bucket 'must' have be named to match the hostname used to access the page e.g staging.406beacons.com

## Required Setup
When starting from a blank slate (no previous AWS setup) the following is required .

- [S3 bucket](https://www.terraform.io/docs/language/settings/backends/s3.html) configured. Bucket key needs to match that in [main.tf](./main.tf)
- Dynamo DB table configured. See [Terraform docs](https://www.terraform.io/docs/language/settings/backends/s3.html#dynamodb-state-locking)
- Ensure that the terraform workspaces for all environments exist
    - `terraform workspace new ${env_name}` where env_name is `dev`, `staging` or `production`
    - `terraform workspace list` allows you to view existing workspaces

## Build and Deploy
The following example shows how to build and deploy a Maintenance Page for staging.

- terraform workspace staging
- terraform plan -var-file="staging.tfvars"
- terraform apply -var-file="staging.tfvars"
- aws s3 sync ./html/ s3://staging.406beacons.com --delete
