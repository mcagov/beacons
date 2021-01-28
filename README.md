[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A private beta service for:

- [406Mhz beacon](https://www.gov.uk/maritime-safety-weather-and-navigation/register-406-mhz-beacons) owners to register their details with the Maritime & Coastguard Agency
- Search and rescue [Mission Control Centres](<https://en.wikipedia.org/wiki/Mission_control_centre_(Cospas-Sarsat)>) to retrieve information about beacons during distress signal activations

This repository contains the frontend application of the service. It is built using [NextJS](https://nextjs.org/) and based on the [GOV.UK Design System](https://design-system.service.gov.uk/).

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

- **Testing the rendering of React components**. We use [Jest's snapshot testing](https://jestjs.io/docs/en/snapshot-testing) to ensure our components render as they should do.
- **Testing logic**. We segregate frontend logic from components by defining reusable TypeScript functions in `src/lib/`. Unit tests for these functions using Jest are in `test/lib`.
- **End-to-end testing**. _TBC, likely to be Cypress._

### Running tests

- `npm run test` -- Runs all tests in the `test/` directory
- `npm run test:watch` -- Runs tests in watch mode

### Updating test snapshots

To update all test snapshots, run: `npm run test:update-all`

To update a specific snapshot, run: `npm run test:update [INSERT TEST NAME PATTERN HERE]`

For example: `npm run test:update Header`

## Deployment

To deploy changes to production:

1.  Develop on a branch (e.g. `feature/foo` or `bugfix/bar`)
2.  Push changes to origin and open a pull request tagging at least one other member of the development team
3.  When approved, merge to `main`
4.  Merging into the `main` branch will trigger a [GitHub Actions workflow](.github/workflows/main.yml) and deploy changes to production
