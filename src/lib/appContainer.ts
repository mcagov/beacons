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
import {
  CreateRegistration,
  ICreateRegistration,
} from "../useCases/createRegistration";
import { IRedirectUserTo, RedirectUserTo } from "../useCases/redirectUserTo";
import {
  ISendGovNotifyEmail,
  SendGovNotifyEmail,
} from "../useCases/sendGovNotifyEmail";
import {
  IVerifyFormSubmissionCookieIsSet,
  VerifyFormSubmissionCookieIsSet,
} from "../useCases/verifyFormSubmissionCookieIsSet";

export interface IAppContainer {
  getAuthenticateUser: () => IAuthenticateUser;
  getCreateRegistration: () => ICreateRegistration;
  getSendGovNotifyEmail: () => ISendGovNotifyEmail;
  getVerifyFormSubmissionCookieIsSet: () => IVerifyFormSubmissionCookieIsSet;
  getRedirectTo: () => IRedirectUserTo;

  getAuthGateway: () => IAuthGateway;
  getBasicAuthGateway: () => IBasicAuthGateway;
  getBeaconsApiGateway: () => IBeaconsApiGateway;
  getGovNotifyGateway: () => IGovNotifyGateway;
}

export class AppContainer implements IAppContainer {
  public getAuthenticateUser(): IAuthenticateUser {
    return new AuthenticateUser(this.getBasicAuthGateway());
  }

  public getCreateRegistration(): ICreateRegistration {
    return new CreateRegistration(
      this.getBeaconsApiGateway(),
      this.getAuthGateway()
    );
  }

  public getSendGovNotifyEmail(): ISendGovNotifyEmail {
    return new SendGovNotifyEmail(this.getGovNotifyGateway());
  }

  public getVerifyFormSubmissionCookieIsSet(): IVerifyFormSubmissionCookieIsSet {
    return new VerifyFormSubmissionCookieIsSet();
  }

  public getRedirectTo(): IRedirectUserTo {
    return new RedirectUserTo();
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
