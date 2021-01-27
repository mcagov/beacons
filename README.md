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
