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

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Authentication

For logging into to the Beacons Registry Back Office, you will need to be added as a guest to the following:

- MCA Azure AD test directory, `mcga.onmicrosoft.com`
- Relevant Azure Security Groups within Azure AD to access the application

Please ask a member of the development team who has permission to do this.

## Deployment

This application is bundled and served with the parent Spring Boot application at "/backoffice".

## Why serve an SPA from within Spring Boot?

See [ADR](https://github.com/mcagov/beacons-integration/blob/main/docs/adr/0007-2021-10-25-serve-backoffice-spa-from-spring.md).
