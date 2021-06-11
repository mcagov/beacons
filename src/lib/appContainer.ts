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
  AuthenticateUser,
  IAuthenticateUser,
} from "../useCases/authenticateUser";
import { redirectUserTo, RedirectUserToFn } from "../useCases/redirectUserTo";
import {
  retrieveAuthToken,
  RetrieveAuthTokenFn,
} from "../useCases/retrieveAuthToken";
import {
  CachedRegistrationRetriever,
  retrieveCachedRegistration,
} from "../useCases/retrieveCachedRegistration";
import {
  retrieveUserFormSubmissionId,
  RetrieveUserFormSubmissionIdFn,
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
  getAuthenticateUser: () => IAuthenticateUser;
  getSubmitRegistration: () => SubmitRegistrationFn;
  getSendConfirmationEmail: () => SendConfirmationEmailFn;
  getVerifyFormSubmissionCookieIsSet: () => VerifyFormSubmissionCookieIsSetFn;
  getRedirectUserTo: () => RedirectUserToFn;
  getRetrieveUserFormSubmissionId: () => RetrieveUserFormSubmissionIdFn;
  getAuthGateway: () => IAuthGateway;
  getBasicAuthGateway: () => IBasicAuthGateway;
  getBeaconsApiGateway: () => IBeaconsApiGateway;
  getGovNotifyGateway: () => IGovNotifyGateway;
  getRetrieveCachedRegistration: () => CachedRegistrationRetriever;
  getRetrieveAccessToken: () => RetrieveAuthTokenFn;
}

export class AppContainer implements IAppContainer {
  public getRetrieveAccessToken(): RetrieveAuthTokenFn {
    return retrieveAuthToken(this);
  }

  public getAuthenticateUser(): IAuthenticateUser {
    return new AuthenticateUser(this.getBasicAuthGateway());
  }

  public getRetrieveUserFormSubmissionId(): RetrieveUserFormSubmissionIdFn {
    return retrieveUserFormSubmissionId;
  }

  public getRetrieveCachedRegistration(): CachedRegistrationRetriever {
    return retrieveCachedRegistration();
  }

  public getSubmitRegistration(): SubmitRegistrationFn {
    return submitRegistration(this);
  }

  public getSendConfirmationEmail(): SendConfirmationEmailFn {
    return sendConfirmationEmail(this);
  }

  public getVerifyFormSubmissionCookieIsSet(): VerifyFormSubmissionCookieIsSetFn {
    return verifyFormSubmissionCookieIsSet;
  }

  public getRedirectUserTo(): RedirectUserToFn {
    return redirectUserTo;
  }

  public getAuthGateway(): IAuthGateway {
    const confidentialClientApplication = new ConfidentialClientApplication(
      appConfig.aadConfig
    );
    return new AadAuthGateway(confidentialClientApplication);
  }

  public getBasicAuthGateway(): IBasicAuthGateway {
    return new BasicAuthGateway();
  }

  public getBeaconsApiGateway(): IBeaconsApiGateway {
    return new BeaconsApiGateway(process.env.API_URL);
  }

  public getGovNotifyGateway(): IGovNotifyGateway {
    return new GovNotifyGateway(process.env.GOV_NOTIFY_API_KEY);
  }
}
