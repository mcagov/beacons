/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({ path: ".env" });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { encode } = require("next-auth/jwt");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  setTestEnvVarsFromSystem(config);
  if (!process.env.JWT_SECRET || !process.env.TEST_USER_AUTH_ID) {
    throw new Error(
      "JWT_SECRET and TEST_USER_AUTH_ID must be set to mint a session token",
    );
  }
  config.env.SESSION_TOKEN = await encode({
    token: {
      sub: process.env.TEST_USER_AUTH_ID,
      email: "beacons_test_b2c@mailsac.com",
      name: "",
    },
    secret: process.env.JWT_SECRET,
    maxAge: 24 * 60 * 60,
  });

  return config;
};

const setTestEnvVarsFromSystem = (config) => {
  config.env.WEBAPP_CLIENT_ID = process.env.WEBAPP_CLIENT_ID;
  config.env.WEBAPP_CLIENT_SECRET = process.env.WEBAPP_CLIENT_SECRET;
  config.env.AAD_TENANT_ID = process.env.AAD_TENANT_ID;
  config.env.AAD_API_ID = process.env.AAD_API_ID;
  config.env.API_URL = process.env.API_URL;
};
