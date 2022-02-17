# Creating new React components

We're creating our own React components from the [GOV.UK Design System](https://design-system.service.gov.uk/components/), using the styles and client-side JavaScript packaged in the [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) node package.

To add a new component:

1.  Create an empty component in `src/components`.
2.  Transpose the HTML from your chosen example on the GOV.UK Design System into the component, resolving any HTML to TSX conversion issues e.g. `class -> className`.
3.  Decide the properties you want to make configurable e.g. `phase` in `PhaseBanner` and extract these to the `props` object.
4.  Check the component renders properly by comparing it with the GOV.UK Design System example.
5.  Use the new component as you choose.
