import { ConfidentialClientApplication } from "@azure/msal-node";
import { appConfig } from "../appConfig";
import { AadAuthGateway, IAuthGateway } from "../gateways/aadAuthGateway";
import {
  BasicAuthGateway,
  IBasicAuthGateway,
} from "../gateways/basicAuthGateway";
import {
  BeaconsApiGateway,
  IBeaconsApiGateway,
} from "../gateways/beaconsApiGateway";
import {
  GovNotifyGateway,
  IGovNotifyGateway,
} from "../gateways/govNotifyApiGateway";
import {
  authenticateUser,
  AuthenticateUserFn,
} from "../useCases/authenticateUser";
import {
  clearCachedRegistration,
  ClearCachedRegistrationFn,
} from "../useCases/clearCachedRegistration";
import { getAccessToken, GetAccessTokenFn } from "../useCases/getAccessToken";
import {
  getCachedRegistration,
  GetCachedRegistrationFn,
} from "../useCases/getCachedRegistration";
import {
  sendConfirmationEmail,
  SendConfirmationEmailFn,
} from "../useCases/sendConfirmationEmail";
import {
  submitRegistration,
  SubmitRegistrationFn,
} from "../useCases/submitRegistration";

export interface IAppContainer {
  /* Use cases */
  authenticateUser: AuthenticateUserFn;
  submitRegistration: SubmitRegistrationFn;
  sendConfirmationEmail: SendConfirmationEmailFn;
  getCachedRegistration: GetCachedRegistrationFn;
  clearCachedRegistration: ClearCachedRegistrationFn;
  getAccessToken: GetAccessTokenFn;

  /* Gateways */
  beaconsApiAuthGateway: IAuthGateway;
  basicAuthGateway: IBasicAuthGateway;
  beaconsApiGateway: IBeaconsApiGateway;
  govNotifyGateway: IGovNotifyGateway;
}

export const appContainer: IAppContainer = {
  /* Simple use cases */
  getCachedRegistration: getCachedRegistration,
  clearCachedRegistration: clearCachedRegistration,

  /* Composite use cases requiring access to other use cases */
  get getAccessToken() {
    return getAccessToken(this);
  },
  get authenticateUser() {
    return authenticateUser(this);
  },
  get submitRegistration() {
    return submitRegistration(this);
  },
  get sendConfirmationEmail() {
    return sendConfirmationEmail(this);
  },

  /* Gateways */
  get beaconsApiAuthGateway() {
    const confidentialClientApplication = new ConfidentialClientApplication(
      appConfig.aadConfig
    );
    return new AadAuthGateway(confidentialClientApplication);
  },
  get basicAuthGateway() {
    return new BasicAuthGateway();
  },
  get beaconsApiGateway() {
    return new BeaconsApiGateway(process.env.API_URL);
  },
  get govNotifyGateway() {
    return new GovNotifyGateway(process.env.GOV_NOTIFY_API_KEY);
  },
};
