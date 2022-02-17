[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![CI/CD Pipeline](https://github.com/mcagov/beacons-service/workflows/CI/CD%20Pipeline/badge.svg)

# Beacons Registration API

This is a Spring Boot API to enable:

- [406Mhz beacon](https://www.gov.uk/maritime-safety-weather-and-navigation/register-406-mhz-beacons) owners to register
  their details with the Maritime & Coastguard Agency
- Search and rescue [Mission Control Centres](<https://en.wikipedia.org/wiki/Mission_control_centre_(Cospas-Sarsat)>) to
  retrieve information about beacons during distress signal activations

## Dependencies

The following dependencies are required to build and test the application.

| Dependency                                               | Version |
| -------------------------------------------------------- | ------- |
| [Java](https://adoptopenjdk.net/)                        | 11      |
| [Docker](https://www.docker.com/products/docker-desktop) | Latest  |
| [nodejs](https://nodejs.org/en/)                         | 14.x    |

Gradle is the build tool for the application. See
the [docs](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:upgrading_wrapper) for updating the Gradle
Wrapper.

## Development

Clone this repo.

Set the Node environment using `nvm use` (having installed [nvm](https://github.com/nvm-sh/nvm))

Install node packages (needed for code formatting): `npm install`

## Local development

The service can be run either locally in your IDE of choice or from the command line by
running: `./gradlew bootRun --args='--spring.profiles.active=dev'`

Local development instances of the backing services, such as PostgreSQL and OpenSearch, can be initiated with the
command `docker compose up`.

## Testing

Integration tests use the naming convention `<name>IntegrationTest`. Unit tests use the naming convention
`<name>UnitTest`.

Both unit and integration tests go in [src/test/java/uk/gov/mca/beacons/api](src/test/java/uk/gov/mca/beacons/api).

### Running tests

- `./gradlew test` runs unit tests
- `./gradlew integrationTest` runs integration tests
- `./gradlew check` runs both unit and integration tests

## Style guide

We use [Prettier-Java](https://github.com/jhipster/prettier-java/tree/c1f867092f74ebfdf68ccb843f8186c943bfdeca) to
format our code and use [Husky](https://typicode.github.io/husky/#/) to run the formatting as a pre-commit hook.

Wildcard imports, `import java.util.*;` should not be used within the application.
See [GDS Programming Languages](https://gds-way.cloudapps.digital/manuals/programming-languages/java.html#imports)
guidance on this and how to configure IntelliJ to ensure it does not use wildcard imports.

As well as during the pre-commit hook, the formatter can be run manually with:

```bash
$ npm run format
```

## Deployment

A Continuous Integration and Deployment (CI/CD) pipeline is configured to deploy to our development environment on
merges into the `main` branch.

Please see the [Beacons Integration](https://github.com/mcagov/beacons-integration) project which manages the
infrastructure-as-code and deployments for the application.

## Jobs

### Manually adding all beacon registrations to OpenSearch (reindexing)

We use OpenSearch to support advanced querying of beacon registrations. Beacons are streamed into OpenSearch
automatically on registration, though if necessary OpenSearch can be manually re-indexed using a job. This will
update OpenSearch to the latest version of the data in Postgres.

To trigger the reindexSearch job, run:

```bash
$ curl -X POST -s http://user:password@localhost:8080/spring-api/job/reindexSearch
{"location":"/spring-api/job/reindexSearch/2"}
```

This will output the path to the job, which can then be checked for its status:

```bash
$ curl -X GET -s http://user:password@localhost:8080/spring-api/job/reindexSearch/2
{"status":"COMPLETED"}
```

Logs are also output to CloudWatch when the job starts and finishes.

## Database schema diagram

With the Beacons Service API running, execute `docker compose up -f docker-compose.schemacrawler.yml`. This will create
a diagram of the database schema at
[schemacrawler/beacons-schema.html](schemacrawler/beacons-schema.html).

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][mit]. This covers both the codebase and any
sample code in the documentation.

The documentation is [&copy; Crown copyright][copyright] and available under the terms of the [Open Government 3.0][ogl]
licence.

[mit]: LICENCE
[copyright]: http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[ogl]: http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
