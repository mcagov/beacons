import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  requestTimeout: 2000,
  defaultCommandTimeout: 5000,
  retries: 3,

  e2e: {
    setupNodeEvents(on, config) {
      config.env.WEBAPP_CLIENT_ID = process.env.WEBAPP_CLIENT_ID;
      config.env.WEBAPP_CLIENT_SECRET = process.env.WEBAPP_CLIENT_SECRET;
      config.env.AAD_TENANT_ID = process.env.AAD_TENANT_ID;
      config.env.AAD_API_ID = process.env.AAD_API_ID;
      config.env.API_URL = process.env.API_URL;
      config.env.SESSION_TOKEN = process.env.SESSION_TOKEN;
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
