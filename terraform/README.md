# Infrastructure-as-code

The terraform files within this directory represents the infrastructure-as-code for the Beacons Registration Project.

## Required Setup

Before the pipeline can be trigger to deploy to AWS, the following setup is required:

- [S3 bucket](https://www.terraform.io/docs/language/settings/backends/s3.html) configured. Bucket key needs to match that in [provider.tf](./provider.tf)
- Dynamo DB table configured. See [Terraform docs](https://www.terraform.io/docs/language/settings/backends/s3.html#dynamodb-state-locking)
- Create ECR for the docker images of the webapp and service and update secrets in [webapp](https://github.com/mcagov/beacons-webapp/settings/secrets/actions) and [service](https://github.com/mcagov/beacons-service/settings/secrets/actions) repositories
- Ensure that the terraform workspaces for all environments exist
  - `terraform workspace new ${env_name}` where env_name is `dev`, `staging` or `production`
  -  `terraform workspace list` allows you to view existing workspaces
- Ensure that the terraform variables file (e.g. `dev.tfvars`, `staging.tfvars`) for each environment exists

## Upgrading terraform modules

For upgrading terraform see [Terraform's upgrade guide](https://www.terraform.io/upgrade-guides/index.html).

For upgrading modules and plugins run the command `terraform init --upgrade` in the current directory. [See official docs](https://www.terraform.io/docs/cli/commands/init.html).