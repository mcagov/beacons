[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![CI/CD Pipeline](https://github.com/mcagov/beacons/actions/workflows/on-push.yml/badge.svg)

# Beacons registration service

The Beacons registration service enables:

- [406Mhz beacon](https://www.gov.uk/maritime-safety-weather-and-navigation/register-406-mhz-beacons) owners to register their details with the Maritime & Coastguard Agency
- Search and rescue [Mission Control Centres](<https://en.wikipedia.org/wiki/Mission_control_centre_(Cospas-Sarsat)>) to retrieve information about beacons during distress signal activations

It comprises three applications:

1. A public-facing frontend that uses [NextJS](https://nextjs.org/) and the [GOV.UK Design System]
   (https://design-system.service.gov.uk/). Source code is in the `webapp/` directory.
2. An API that uses [Spring Boot](https://spring.io/projects/spring-boot), [Postgres](https://www.postgresql.org/)
   and [OpenSearch](https://opensearch.org/). Source code is in the `service/` directory.
3. A backoffice single-page application (SPA) that uses [React](https://reactjs.org/docs/create-a-new-react-app.html)
   to allow users in MCA to query and perform operations on beacon registrations. Source code is in
   `service/src/main/backoffice`. The SPA is served by Spring Boot.

## Infrastructure-as-code

The [Terraform](./terraform) directory contains the Terraform code for managing the infrastructure for the Beacons
registration service.

## Deployment

Automated testing, building and deployment is performed using GitHub Actions with configuration held in
`.github/workflows`.

### Development environment

A build and deployment to the development environment is triggered on each push to `main`. Docker images are tagged
with the hash of the triggering commit and published to AWS Elastic Container Registry. Images built and deployed to
for the development environment are ephemeral and not used anywhere else.

### Staging environment

Creating a pre-release triggers a versioned deployment to the staging environment of code at the HEAD of the main
branch. Docker images are tagged with the version tag of the release. Version tags must match the pattern `v*.*`.

### Production environment

Changing the status of a pre-release to `release` triggers a deployment to production of the images that were created
for the staging environment. [Environment protection](https://docs.github.com/en/actions/managing-workflow-runs/reviewing-deployments)
is applied to the `production` environment such that another member of the development team is prompted to approve
deployments to production.

## Architectural Decision Records (ADRs)

We use [ADRs](./docs/adr) to document design choices that address functional and non-functional requirements that are architecturally significant to the Beacons Registration project. Please see this [record](docs/adr/0003-2021-02-24-when-to-adr.md) for how and when to document ADRs for the project.

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
