# Testing

This directory contains system-level tests of the Beacons service. For isolated testing of the components of
the Beacons system, see the `../webapp/`, `../service/` and `../backoffice/` directories.

## End-to-end testing

Automated end-to-end tests use [Cypress](https://www.cypress.io/) and are run in GitHub Actions against the publish images before deploying to the `dev` and `staging` environments.

To run end-to-end tests locally:

- Copy `tests/.env.example` as `tests/.env` and populate it with the contents of the "Beacons Webapp Local .env.local config" secure note in 1Password for the corresponding environment variables.

```shell
docker compose -f docker-compose.e2e.yml up
```

In another terminal window...

```shell
npm run test:e2e
```

### Occasional Cypress test failures

Automated end-to-end tests require the `SESSION_TOKEN`, and may fail unexpectedly, due to rotating session tokens.

To resolve this:

- Log into local, dev or staging using the "Test B2C account" from 1Password.
- Locate the session token in dev tools: Application -> cookies -> \_\_Secure-next-auth.session-token -> value.
- Copy this value and update the corresponding secret:
  - `SESSION_TOKEN` in your local `.env` files.
  - `SESSION_TOKEN` in the "Beacons Webapp Local .env.local config" secure note in 1Password.
  - `TEST_WEBAPP_AZURE_B2C_SESSION_TOKEN` in the GitHub repository.

## Smoke testing

The smoke tests are currently manual. We are looking to automate these.

- [Pre-release testing scenarios](pre-release-testing-scenarios.md) must be performed:
  - before drafting a release, against the dev environment.
  - after drafting a release, against the staging environment, before publishing the release.
- [Post-release testing scenarios](post-release-testing-scenarios.md) must be performed immediately after a published release has been deployed to production.
