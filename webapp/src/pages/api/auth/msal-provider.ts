import * as msal from "@azure/msal-browser";

const env = {
  AZURE_B2C_CLIENT_ID: "43557393-7cd2-416e-8bb2-96283dbdbcbc",
  AZURE_B2C_CLIENT_SECRET: "bcC8Q~ps3n2bH8QVJknfBX-RM4rfOb1heGZm5ce4",
  AZURE_B2C_TENANT_NAME: "B2CMCGA",
  AZURE_B2C_TENANT_ID: "da0cadc6-44c5-4830-bb04-82bddfd2f040",
  AZURE_B2C_LOGIN_FLOW: "B2C_1_login_beacons",
};

const msalConfig = {
  auth: {
    clientId: env.AZURE_B2C_CLIENT_ID,
    authority: `https://${env.AZURE_B2C_TENANT_NAME}.b2clogin.com/${env.AZURE_B2C_TENANT_NAME}.onmicrosoft.com`,
    knownAuthorities: [`https://${env.AZURE_B2C_TENANT_NAME}.b2clogin.com`],
    clientSecret: env.AZURE_B2C_CLIENT_SECRET,
  },
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);
