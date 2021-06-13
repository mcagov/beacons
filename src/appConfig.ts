import { Configuration } from "@azure/msal-node";

const aadConfig: Configuration = {
  auth: {
    clientId: process.env.WEBAPP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AAD_TENANT_ID}`,
    clientSecret: process.env.WEBAPP_CLIENT_SECRET,
  },
};

export const appConfig = {
  aadConfig,
};
