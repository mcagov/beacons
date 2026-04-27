# Testing

This directory contains system-level tests of the Beacons service. For isolated testing of the components of
the Beacons system, see the `../webapp/`, `../service/` and `../backoffice/` directories.

## End-to-end testing

Automated end-to-end tests use [Cypress](https://www.cypress.io/) and are run in GitHub Actions against the publish images before deploying to the `dev` and `staging` environments.

To run end-to-end tests locally:

- Copy `tests/.env.example` as `tests/.env` and populate it with the contents of the "Beacons Webapp Local .env.local config" secure note in 1Password for the corresponding environment variables.

```sh
$ docker compose -f docker-compose.e2e.yml up
$ npm run test:e2e
```

### The Cypress end-to-end tests need a valid `SESSION_TOKEN` to run

If you experience unexpected Cypress test failures with errors like...

```console
TypeError: Cannot destructure property 'authId' of 'session.body.user' as it is undefined.
```

...you may well need to update the `SESSION_TOKEN` used by the tests locally and in GitHub Actions.

- Log into local/dev/staging webapp using the "Test B2C account" credentials from 1Password.
  - Note that any time you use this account, it will create a new session token, so the following steps need carrying out regardless.
- Locate the session token in your broswer's development tools: Application -> cookies -> __Secure-next-auth.session-token -> value.
- Copy this value.
- Update the following with this value:
  - `TEST_WEBAPP_AZURE_B2C_SESSION_TOKEN` in https://github.com/mcagov/beacons/settings/secrets/actions.
  - `SESSION_TOKEN` in the "Beacons Webapp Local .env.local config" in 1Password.
- Make sure all the engineers know to update their local `webapp/.env.local` and `tests/.env` files.

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
