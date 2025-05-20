import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  requestTimeout: 4000,
  defaultCommandTimeout: 5000,
  retries: 3,
  e2e: {
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://127.0.0.1:3000",
    specPattern: "cypress/endToEnd/**/*.spec.ts",
    experimentalRunAllSpecs: true,
  },
});
