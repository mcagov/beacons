# Testing

This directory contains system-level tests of the Beacons service. For isolated testing of the components of
the Beacons system, see the `../webapp/`, `../service/` and `../backoffice/` directories.

## End-to-end testing

Automated end-to-end tests use [Cypress](https://www.cypress.io/) and are run in GitHub Actions against the publish images before deploying to the `dev` and `staging` environments.

To run end-to-end tests locally:

- Copy `tests/.env.example` as `tests/.env` and populate it with the contents of the "Beacons Webapp Local .env.local config" secure note in 1Password for the corresponding environment variables.

```sh
$ podman compose -f docker-compose.e2e.yml up
$ npm run test:e2e
```

### The Cypress end-to-end tests require `JWT_SECRET` and `TEST_USER_AUTH_ID`

The session token is minted automatically at test startup. Ensure the following are set:

- `JWT_SECRET` — the NextAuth secret
- `TEST_USER_AUTH_ID` — the Azure B2C object ID of `beacons_test_b2c@mailsac.com`

In GitHub Actions and Dependabot secrets, `TEST_WEBAPP_AZURE_B2C_TEST_USER_ID` must be set:

```console
gh secret set TEST_WEBAPP_AZURE_B2C_TEST_USER_ID -R mcagov/beacons
gh secret set TEST_WEBAPP_AZURE_B2C_TEST_USER_ID -R mcagov/beacons --app dependabot
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
