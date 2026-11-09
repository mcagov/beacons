# Testing

This directory contains system-level tests of the Beacons service. For isolated testing of the components of
the Beacons system, see the `../webapp/`, `../service/` and `../backoffice/` directories.

## End-to-end testing

Automated end-to-end tests use [Cypress](https://www.cypress.io/) and are run in GitHub Actions against the publish images before deploying to the `dev` and `staging` environments.

To run end-to-end tests locally, ensure the service is running as per the root README with Azure authentication (not local auth mode; do not set `BEACONS_LOCAL_AUTH=true`), then:

```sh
$ npm run test:e2e
```

## Integration testing

As part of our integration tests, a test user "test@test.com" is created in the Azure TEST tenancy. As a part of these tests, this user should be automatically deleted.
In the event that the test user is not deleted, the integration tests can fail:

- "Another object with the same value for property proxyAddresses already exists."

In order to remediate this failure, the "test@test.com" user will need to be deleted from the test tenancy. The tests should then succeed.

## Smoke testing

The smoke tests are currently manual. We are looking to automate these.

- [Pre-release testing scenarios](pre-release-testing-scenarios.md) must be performed:
  - before drafting a release, against the dev environment.
  - after drafting a release, against the staging environment, before publishing the release.
- [Post-release testing scenarios](post-release-testing-scenarios.md) must be performed immediately after a published release has been deployed to production.
