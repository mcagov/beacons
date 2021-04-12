[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![CI/CD pipeline](https://github.com/mcagov/beacons-webapp/workflows/CI/CD%20pipeline/badge.svg)

# Beacons Registration Webapp

The frontend application for the Beacons Registration service enables:

- [406Mhz beacon](https://www.gov.uk/maritime-safety-weather-and-navigation/register-406-mhz-beacons) owners to register their details with the Maritime & Coastguard Agency
- Search and rescue [Mission Control Centres](<https://en.wikipedia.org/wiki/Mission_control_centre_(Cospas-Sarsat)>) to retrieve information about beacons during distress signal activations

This repository contains the frontend application of the service. It is built using [NextJS](https://nextjs.org/) and based on the [GOV.UK Design System](https://design-system.service.gov.uk/).

This application depends on the [Beacons Registration API](https://github.com/mcagov/beacons-service).

## Getting started

### Dependencies

To develop locally, you'll need:

- [Node.JS](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

### Running the application

First, install dependencies:

```bash
npm install
```

Then, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running in Docker

To run the application in a production-like environment:

```bash
docker-compose up
```

## Testing

Our approach to testing:

- **Testing the rendering of React components**. We use [React testing library](https://testing-library.com/docs/react-testing-library/intro/) to ensure the rednered pages are what the user expects to see.
- **Testing logic**. We segregate frontend logic from components by defining reusable TypeScript functions in `src/lib/`. Unit tests for these functions using Jest are in `test/lib`.
- **End-to-end testing**. We use [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html) to ensure the logic of the frontend matches the requirements.

### Running tests

- `npm run test` -- Runs all tests in the `test/` directory
- `npm run test:watch` -- Runs tests in watch mode

### Running Cypress tests

- `npm run dev` -- Start the app if it's not already running
- `npm run cypress:open` -- Run Cypress tests in the `cypress/integration` directory with the [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html#Overview)
- `npm run cypress:watch` -- Run Cypress tests with the Test Runner, with Cypress watching test files for changes
- `npm run cypress:run` -- Run Cypress tests in the `cypress/integration` directory in the [command line](https://docs.cypress.io/guides/guides/command-line.html#cypress-run)
- `npm run cypress:run:firefox` -- Run Cypress tests in the `cypress/integration` directory using Firefox (requires Firefox to be installed)

## Deployment

A Continuous Integration and Deployment (CI/CD) pipeline is configured to deploy to our development environment on merges into the `main` branch.

Please see the [Beacons Integration](https://github.com/mcagov/beacons-integration) project which manages the infrastructure-as-code and deployments for the application.

To deploy changes:

1.  Develop on a branch (e.g. `feature/foo` or `bugfix/bar`)
2.  Push changes to origin and open a pull request tagging at least one other member of the development team
3.  When approved, merge to `main`
4.  Merging into the `main` branch will trigger a [GitHub Actions workflow](.github/workflows/main.yml) and deploy changes to the development environment

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][mit].
This covers both the codebase and any sample code in the documentation.

The documentation is [&copy; Crown copyright][copyright] and available under the terms
of the [Open Government 3.0][ogl] licence.

[mit]: LICENCE
[copyright]: http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[ogl]: http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
