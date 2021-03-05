# Frontend integration testing

## Status

Accepted

## Context

The [frontend application](https://github.com/mcagov/beacons-webapp) currently does not have integration tests, and we feel that adding them would help development of the app.

## Decision

We will use [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) to write integration tests for the frontend app in the [frontend repository](https://github.com/mcagov/beacons-webapp).

These tests will be used to check the functionality of the application and its pages.

These `integration` tests are within the frontend app - we would mock any API calls from the frontend.

We will also continue to use unit tests to test other (lower level?) logic that Cypress tests will not cover.

For example:

- Testing that the `back` button on a page will take you to the previous page - Cypress test
- Testing that the `handlePageRequest` function works as expected - unit test

Following a discussion around the different types of tests and their definitions, we see them as:

- Unit tests - isolated units tested in both the webapp and API repositories
- Integration tests - tests between system boundaries. API = API service and Database, Webapp = user/browser and webapp
- End-to-End tests - Testing end-to-end flow = webapp, service, database

## Key Benefits

- Allows us to add tests that align with Acceptance Criteria
- Gives us confidence that our changes will not break functionality in the app
- Reduces the need for manual testing

## Key Drawbacks

- Requires time and effort in the development process as devs will need to take time to write these tests
- Slows down the test suite and therefore the CI/CD pipeline and deployment process

## Alternatives

We could continue not having integration tests:

- We would always need manual testing as we make changes
- This is time-consuming and possibly not as thorough as automated tests based on Acceptance Criteria

We could use a different testing tool, such as [Selenium](https://www.selenium.dev/documentation/en/):

- Selenium has been around longer than Cypress
- Members of the team have had negative experiences using it
- Cypress is a well-know alternative and is gaining popularity

## Consequences

The development team might be slowed down initially, as we would need to take time and effort to add tests around existing pages.

However, a lot of that work will be reusable code (e.g. a reusable function for checking the back button).

So once that is in place, adding tests for new pages shouldn't be as time-consuming and should help us develop faster.

## Supporting Documentation

- [Trello ticket for implementing Cypress](https://trello.com/c/U7YwzUsE/282-set-up-end-to-end-functional-tests-integration)
- [PR for this work](https://github.com/mcagov/beacons-webapp/pull/128)
- [Cypress docs](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)
- [Selenium docs](https://www.selenium.dev/documentation/en/)
- [Cypress vs. Selenium](https://blog.logrocket.com/cypress-io-the-selenium-killer/)
- [Cypress vs Selenium: Key Differences](https://www.browserstack.com/guide/cypress-vs-selenium)
