import { ConfidentialClientApplication } from "@azure/msal-node";

export interface AuthGateway {
  getAccessToken: (cca?: ConfidentialClientApplication) => Promise<string>;
}
