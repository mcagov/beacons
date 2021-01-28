![CI/CD Pipeline](https://github.com/madetech/mca-beacons-integration/workflows/CI/CD%20Pipeline/badge.svg)

# Beacons Registration Integration Project

This project is the integration project for the MCA Beacons Registration Application. This integration project manages the deployment of the following:

- [Beacons Registration Webapp](https://github.com/madetech/mca-beacons-webapp)
- [Beacons Registration Service](https://github.com/madetech/mca-beacons-service)

## Infrastructure-as-code

The [Terraform](./terraform) directory contains the Terraform code for managing the infrastructure for the Beacons Registration Application.

## Deployment

### Development Environment

A [Continuous Integration and Deployment (CI/CD) pipeline](./.github/workflows/main.yml) is configured, using [GitHub Actions](https://docs.github.com/en/actions), to deploy a release to the development environment on any changes to the `main` branches of the Webapp, Service, and Integration project repositories.

The pipeline provisions the infrastructure, according to the Terraform definition files, and deploys the latest versions of the Docker images for the Webapp and Service.

### UAT Environment

_TODO_

### Production Environment

_TODO_

## Architectural Decision Records (ADRs)

We use [ADRs](./docs/adr) to document design choices that address functional and non-functional requirements that are architecturally significant to the Beacons Registration project. Please see the [template](./docs/adr/adr.template) for how to document ADRs for the project.

## Installing AWS CLI

Please see the [AWS installation guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and [configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) for configuring the AWS CLI required for Terraform when managing the infrastructure

## License

_TODO_
