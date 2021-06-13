import { ConfidentialClientApplication } from "@azure/msal-node";
import { appConfig } from "../../appConfig";
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
import { getAccessToken, GetAccessTokenFn } from "../useCases/getAccessToken";
import {
  getCachedRegistration,
  GetCachedRegistrationFn,
} from "../useCases/getCachedRegistration";
import { redirectUserTo, RedirectUserToFn } from "../useCases/redirectUserTo";
import {
  retrieveUserFormSubmissionId,
  UserFormSubmissionIdFn,
} from "../useCases/retrieveUserFormSubmissionId";
import {
  sendConfirmationEmail,
  SendConfirmationEmailFn,
} from "../useCases/sendConfirmationEmail";
import {
  submitRegistration,
  SubmitRegistrationFn,
} from "../useCases/submitRegistration";
import {
  verifyFormSubmissionCookieIsSet,
  VerifyFormSubmissionCookieIsSetFn,
} from "../useCases/verifyFormSubmissionCookieIsSet";

export interface IAppContainer {
  /* Use cases */
  authenticateUser: AuthenticateUserFn;
  submitRegistration: SubmitRegistrationFn;
  sendConfirmationEmail: SendConfirmationEmailFn;
  verifyFormSubmissionCookieIsSet: VerifyFormSubmissionCookieIsSetFn;
  redirectUserTo: RedirectUserToFn;
  userFormSubmissionId: UserFormSubmissionIdFn;
  getCachedRegistration: GetCachedRegistrationFn;
  getAccessToken: GetAccessTokenFn;

  /* Gateways */
  getAuthGateway: () => IAuthGateway;
  getBasicAuthGateway: () => IBasicAuthGateway;
  getBeaconsApiGateway: () => IBeaconsApiGateway;
  getGovNotifyGateway: () => IGovNotifyGateway;
}

export const appContainer: IAppContainer = {
  /* Use cases */
  get getAccessToken() {
    return getAccessToken(this);
  },
  get authenticateUser() {
    return authenticateUser(this);
  },
  get userFormSubmissionId() {
    return retrieveUserFormSubmissionId;
  },
  get getCachedRegistration() {
    return getCachedRegistration;
  },
  get submitRegistration() {
    return submitRegistration(this);
  },
  get sendConfirmationEmail() {
    return sendConfirmationEmail(this);
  },
  get verifyFormSubmissionCookieIsSet() {
    return verifyFormSubmissionCookieIsSet;
  },
  get redirectUserTo() {
    return redirectUserTo;
  },

  /* Gateways */
  getAuthGateway: () => {
    const confidentialClientApplication = new ConfidentialClientApplication(
      appConfig.aadConfig
    );
    return new AadAuthGateway(confidentialClientApplication);
  },
  getBasicAuthGateway: () => new BasicAuthGateway(),
  getBeaconsApiGateway: () => new BeaconsApiGateway(process.env.API_URL),
  getGovNotifyGateway: () =>
    new GovNotifyGateway(process.env.GOV_NOTIFY_API_KEY),
};
