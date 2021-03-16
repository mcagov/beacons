[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![CI/CD Pipeline](https://github.com/mcagov/beacons-integration/workflows/CI/CD%20Pipeline/badge.svg)

# Beacons Registration Integration Project

This project is the integration project for the MCA Beacons Registration Application. This integration project manages the deployment of the following:

- [Beacons Registration Webapp](https://github.com/mcagov/beacons-webapp)
- [Beacons Registration Service](https://github.com/mcagov/beacons-service)

## Infrastructure-as-code

The [Terraform](./terraform) directory contains the Terraform code for managing the infrastructure for the Beacons Registration Application.

## Deployment

### Development Environment

A [Continuous Integration and Deployment (CI/CD) pipeline](https://github.com/mcagov/beacons-integration/actions/workflows/main.yml) is configured, using [GitHub Actions](https://docs.github.com/en/actions), to deploy a release to the development environment on any changes to the `main` branches of the Webapp, Service, and Integration project repositories.

The pipeline provisions the infrastructure, according to the Terraform definition files, and deploys the latest versions of the Docker images for the Webapp and Service.

### Staging Environment

_TODO_

### Production Environment

_TODO_

## Architectural Decision Records (ADRs)

We use [ADRs](./docs/adr) to document design choices that address functional and non-functional requirements that are architecturally significant to the Beacons Registration project. Please see this [record](docs/adr/0003-2021-02-24-when-to-adr.md) for how and when to document ADRs for the project.

### Generating ADR index page

There is a pre-commit hook in the [package.json](./package.json) which will regenerate the ADR index page. This requires [Node.JS](https://nodejs.org/en/) to be installed and for you to run `npm install` for the hook to work.

## Installing AWS CLI

Please see the [AWS installation guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and [configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) for configuring the AWS CLI required for Terraform when managing the infrastructure

## License

Unless stated otherwise, the codebase is released under [the MIT License][mit].
This covers both the codebase and any sample code in the documentation.

The documentation is [&copy; Crown copyright][copyright] and available under the terms
of the [Open Government 3.0][ogl] licence.

[mit]: LICENCE
[copyright]: http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[ogl]: http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
