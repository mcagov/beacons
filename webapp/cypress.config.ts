import { defineConfig } from "cypress";
import "./cypress/plugins/index.js";
require("dotenv").config({ path: ".env.local" });

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  requestTimeout: 2000,
  defaultCommandTimeout: 5000,
  retries: 3,

  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
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
