import * as msal from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_B2C_CLIENT_ID,
    authority: `https://${process.env.AZURE_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_B2C_TENANT_NAME}.onmicrosoft.com`,
    knownAuthorities: [
      `https://${process.env.AZURE_B2C_TENANT_NAME}.b2clogin.com`,
    ],
    clientSecret: process.env.AZURE_B2C_CLIENT_SECRET,
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

export { msalInstance };