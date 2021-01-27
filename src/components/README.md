# Creating new React components

We're creating our own React components from the [GOV.UK Design System](https://design-system.service.gov.uk/components/), using the styles and client-side JavaScript packaged in the [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) node package.

To add a new component:

1.  Create a new test in `test/components`.
2.  Create an empty component in `src/components`.
3.  Transpose the HTML from your chosen example on the GOV.UK Design System into the component, resolving any HTML to TSX conversion issues e.g. `class -> className`.
4.  Decide the properties you want to make configurable e.g. `phase` in `PhaseBanner` and extract these to the `props` object.
5.  Check the component renders properly by comparing it with the GOV.UK Design System example.
6.  If all is well, run the tests to take a snapshot of the component. Future component rendering will be tested against this snapshot, with regressions causing test failures.
7.  Use the new component as you choose.
