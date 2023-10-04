import { defineConfig } from "cypress";

import { setupNodeEvents } from "./cypress/plugins/index";

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  requestTimeout: 2000,
  defaultCommandTimeout: 5000,
  retries: 3,

  e2e: {
    setupNodeEvents,
    baseUrl: "http://127.0.0.1:3000",
    specPattern: "cypress//**/*.spec.ts",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
