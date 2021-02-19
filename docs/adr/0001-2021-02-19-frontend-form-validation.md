# Frontend form validation

## Status

Accepted

## Context

The problem domain requires validation of beacon data prior to:

- the user progressing through a multi-stage form;
- submitting the data to the backend service.

With potentially many pages allowing the user to enter data, we needed a reusable pattern to validate form submissions in a similar way on each page and before submission to the backend service.

Meeting the requirement for multi-stage, client-side form validation is complicated by:

- The Government Digital Service requirement digital services [should be fully useable without depending on client-side JavaScript](https://www.gov.uk/service-manual/technology/using-progressive-enhancement) so maximum accessibility is achieved.
- Conventional [NextJS patterns](https://nextjs.org/blog/forms) for form validation relying on client-side JavaScript via `onSubmit` event handlers, which we can't use.

## Decision

We decided to create a stateless `FormValidator` class with a static `validate()` method. `validate()` takes `formData` key/value pairs and returns a `validationResponse` containing whether or not each entry in `formData` is valid and any associated error messages.

For example:

```typescript
const formData = {
  manufacturer: "Raleigh",
  hexId: "",
};

const validationResponse = (FormValidator.validate(formData) = {
  manufacturer: {
    valid: true,
    invalid: false,
    errorMessages: [],
  },
  hexId: {
    valid: false,
    invalid: true,
    errorMessages: ["Required],
  },
});
```

Validation rules are stored as `FieldValidators` in the global `fieldValidatorLookup`, and are accessed by key. This means keys used in `formData` must match keys in `fieldValidatorLookup`.

The client form pages use the [NextJS `getServerSideProps()` ](https://nextjs.org/docs/basic-features/data-fetching) function to validate `formData` on each POST request, thus allowing form validation to take place on the server, not the client.

For now, we have discounted the following options for form validation:

| Frontend form validation option                       | Decision                                                                                      |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Client-side React libraries (Formik, react-hook-form) | **Discounted** - Relies on client-side JavaScript, likely to be unsuited to public-facing     |
|                                                       | service. May be useful for back office/MCC application.                                       |
| Roll-our-own form builder                             | **Wait and see** - We decided YAGNI, for now. Continue with hand-build forms and plumb in     |
|                                                       | our `FormValidator` object.                                                                   |
| Use a validation library (jsonschema, Joi)            | **Wait and see** - We decided YAGNI, for now. Continue with creating `FieldValidator` classes |
|                                                       | for new fields that require validating.                                                       |

## Consequences

- ✅ Minimum use case for form validation is catered for without the overhead of a third-party library.
- ✅ Effort on building a form builder was available for more value-adding items at this stage in the delivery.
- ✅ Development team have greater control over validation of complex form fields requiring hitting remote services, e.g. postcode lookup, hexId validation using Cospas-Sarsat API.
- ❌ Validation written in Typescript not currently shareable with Java backend service (as may be a benefit of using jsonschema node package or similar)
- ❌ Light coupling of logic concern (what is the error?) with how it should be communicated to the user (`errorMessages`). May be reduced through use of a lookup enum in the caller of `FormValidator.validate()`.

## Supporting Documentation

- [Relevant PR](https://github.com/madetech/mca-beacons-webapp/pull/93)
- [FormValidator.ts](https://github.com/madetech/mca-beacons-webapp/blob/main/src/lib/formValidator.ts) and [tests](https://github.com/madetech/mca-beacons-webapp/blob/main/test/lib/formValidator.test.ts)
- [FieldValidator.ts](https://github.com/madetech/mca-beacons-webapp/blob/main/src/lib/fieldValidators.ts) and [tests](https://github.com/madetech/mca-beacons-webapp/blob/main/test/lib/fieldValidators.test.ts)
