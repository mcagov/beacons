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

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: ".env.local" });

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  setTestEnvVarsFromSystem(config);

  return config;
};

const setTestEnvVarsFromSystem = (config) => {
  config.env.WEBAPP_CLIENT_ID = process.env.WEBAPP_CLIENT_ID;
  config.env.WEBAPP_CLIENT_SECRET = process.env.WEBAPP_CLIENT_SECRET;
  config.env.AAD_TENANT_ID = process.env.AAD_TENANT_ID;
  config.env.AAD_API_ID = process.env.AAD_API_ID;
  config.env.API_URL = process.env.API_URL;
  config.env.SESSION_TOKEN = process.env.SESSION_TOKEN;
};
