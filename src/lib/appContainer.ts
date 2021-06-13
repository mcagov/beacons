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
import {
  clearCachedRegistration,
  ClearCachedRegistration,
} from "../useCases/clearCachedRegistration";
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
  clearCachedRegistration: ClearCachedRegistration;
  getAccessToken: GetAccessTokenFn;

  /* Gateways */
  getAuthGateway: IAuthGateway;
  basicAuthGateway: IBasicAuthGateway;
  beaconsApiGateway: IBeaconsApiGateway;
  govNotifyGateway: IGovNotifyGateway;
}

export const appContainer: IAppContainer = {
  /* Simple use cases */
  getCachedRegistration: getCachedRegistration,
  verifyFormSubmissionCookieIsSet: verifyFormSubmissionCookieIsSet,
  redirectUserTo: redirectUserTo,
  clearCachedRegistration: clearCachedRegistration,

  /* Composite use cases requiring access to the container */
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
  get userFormSubmissionId() {
    return retrieveUserFormSubmissionId;
  },

  /* Gateways */
  get getAuthGateway() {
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
