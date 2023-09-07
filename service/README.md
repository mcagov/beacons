[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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

## Local development

Set the Node environment using `nvm use` (having installed [nvm](https://github.com/nvm-sh/nvm))

Install node packages (needed for code formatting): `npm install`

### Configuration

- Create a file in ./src/main/resources called application-dev.yml
- Fill it with the contents of the 'Beacons service local application-dev.yml' entry in 1Password
  - Copying and pasting this into your new application-dev.yml can sometimes format the configuration incorrectly: please see the existing application.yml file for the pattern to follow
- In IntelliJ, ensure your run configuration Environment variables include `spring_profiles_active=dev`. This will enable the IDE to use your new application-dev.yml configuration settings.

The service can be run either locally in your IDE of choice or from the command line by
running: `./gradlew bootRun --args='--spring.profiles.active=dev'`

Local development instances of the backing services, such as PostgreSQL and OpenSearch, can be initiated with the
command `docker compose up`.

## Testing

### Configuration for Tests

- The test project has its own application.yml file containing several sensitive MICROSOFT_GRAPH environment variables
- These do not have values in the actual file as they are secrets. To ensure these variables have values at runtime, make a .sh file on your machine and fill it with the contents of 'Set Microsoft Graph sensitive values as local Bash env vars' in 1Password.
- Run this file from the /service directory: `source set_microsoft_graph_values.sh`
- The integration tests need these settings in order to create, update and delete a user in the test Azure AD B2C environment.

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

## Jobs

### Manually adding all beacon registrations to OpenSearch (reindexing)

We use OpenSearch to support advanced querying of beacon registrations. Beacons are streamed into OpenSearch
automatically on registration, though if necessary OpenSearch can be manually re-indexed using a job. This will
update OpenSearch to the latest version of the data in Postgres.

To trigger the reindexSearch job, access the `/admin` path of the Backoffice application on the required environment,
where you'll see a button to trigger the job.

The progress of the job can then be monitored in the logs.

## Database schema diagram

With the Beacons Service API running, execute `docker compose up -f docker-compose.schemacrawler.yml`. This will create
a diagram of the database schema at
[schemacrawler/beacons-schema.html](schemacrawler/beacons-schema.html).
