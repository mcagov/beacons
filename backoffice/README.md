# beacons-backoffice

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the Backoffice SPA sub-directory, you can run:

### `npm start`

Runs the app in the development mode with the Beacons Service API stubbed by [MirageJS](https://miragejs.com/).
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

To run the app in local development mode without an API stub, run `npm run start:no-api-stub`.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Authentication

For logging into to the Beacons Registry Back Office, you will need to be added as a guest to the following:

- MCA Azure AD test directory, `mcga.onmicrosoft.com`
- Relevant Azure Security Groups within Azure AD to access the application

Please ask a member of the development team who has permission to do this.

## Deployment

This application is bundled and served with the parent Spring Boot application at "/backoffice".

## Why serve an SPA from within Spring Boot?

See [ADR](https://github.com/mcagov/beacons-integration/blob/main/docs/adr/0007-2021-10-25-serve-backoffice-spa-from-spring.md).

## Mutation testing

We use [Stryker Mutator](https://stryker-mutator.io/docs/stryker-js/introduction/) as a tool to help us understand how much we can trust our unit tests.

Every mutation that survives is a line of code that we can change without it being picked up by our unit tests.

To run the mutation tests:

```shell
# From the backoffice directory...

stryker run
```

This will take about an hour, so you are not going to be running it after every commit.

Once it completes, there should be an HTML report in `reports/mutation/mutation.html`.
