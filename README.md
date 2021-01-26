[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Project structure

We separate the frontend in to three building blocks:

1.  **Components**. The individual components, most likely derived from the [GOV.UK Design System](https://design-system.service.gov.uk/components/).
2.  **Pages**. A page or view as it is displayed to the user, comprising several components.
3.  **Functions**. The logical functionality used by components and pages, most likely expressed in vanilla TypeScript.

```
├── node_modules
|   └── ...
├── public
│   └── assets
├── src
│   ├── components // Components go here
│   ├── lib // Functions go here
│   ├── pages // Pages go here
│   └── styles
└── test
    ├── components
    ├── lib
    └── pages
```

## Testing

Our approach to testing:

- **Testing the rendering of React components**. We use [Jest's snapshot testing](https://jestjs.io/docs/en/snapshot-testing) to ensure our components render as they should do.
- **Testing logic**. We segregate frontend logic from components by defining reusable TypeScript functions in `src/lib/`. Unit tests for these functions using Jest are in `test/lib`.
- **End-to-end testing**. _TBC, likely to be Cypress._

### Running tests

- `npm run test` -- Runs all tests in the `test/` directory
- `npm run test:watch` -- Runs tests in watch mode

### Creating new React components

We're creating our own React components from the [GOV.UK Design System](https://design-system.service.gov.uk/components/), using the styles and client-side JavaScript packaged in the [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) node package.

To add a new component:

1.  Create a new test in `test/components`.
2.  Create an empty component in `src/components`.
3.  Transpose the HTML from your chosen example on the GOV.UK Design System into the component, resolving any HTML to TSX conversion issues e.g. `class -> className`. 4. Decide the properties you want to make configurable e.g. `phase` in `PhaseBanner` and extract these to the `props` object.
4.  Check the component renders properly by comparing it with the GOV.UK Design System example.
5.  If all is well, run the tests to take a snapshot of the component. Future component rendering will be tested against this snapshot, with regressions causing test failures.
6.  Use the new component as you choose.

### Updating test snapshots

To update all test snapshots, run: `npm run test:update-all`

To update a specific snapshot, run: `npm run test:update [INSERT TEST NAME PATTERN HERE]`

For example: `npm run test:update Header`
