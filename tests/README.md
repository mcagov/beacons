# Testing

This directory contains system-level tests of the Beacons service. For isolated testing of the components of
the Beacons system, see the `../webapp/`, `../service/` and `../backoffice/` directories.

## End-to-end testing

Automated end-to-end tests use [Cypress](https://www.cypress.io/) and are run in GitHub Actions after deploying to the `dev` and `staging` environments.

To run end-to-end tests locally:

```sh
$ docker compose -f docker-compose.e2e.yml up
$ npm run test:e2e
```

## Smoke testing

The smoke tests are currently manual. We are looking to automate these.

- [Pre-release testing scenarios](pre-release-testing-scenarios.md) must be performed after drafting a pre-release
  to the staging environment and before releasing to production.
- [Post-release testing scenarios](post-release-testing-scenarios.md) must be performed immediately after releasing
  to production.
