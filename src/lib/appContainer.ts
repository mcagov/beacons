import { IAuthGateway } from "../gateways/aadAuthGateway";
import { IBasicAuthGateway } from "../gateways/basicAuthGateway";
import { IBeaconsApiGateway } from "../gateways/beaconsApiGateway";
import { IGovNotifyGateway } from "../gateways/govNotifyApiGateway";
import { IAuthenticateUser } from "../useCases/authenticateUser";
import { ICreateRegistration } from "../useCases/createRegistration";
import { ISendGovNotifyEmail } from "../useCases/sendGovNotifyEmail";

export interface IAppContainer {
  getAuthenticateUser: () => IAuthenticateUser;
  getCreateRegistration: () => ICreateRegistration;
  getSendGovNotifyEmail: () => ISendGovNotifyEmail;

  getAuthGateway: () => IAuthGateway;
  getBasicAuthGateway: () => IBasicAuthGateway;
  getBeaconsApiGateway: () => IBeaconsApiGateway;
  getGovNotifyGateway: () => IGovNotifyGateway;
}

export class AppContainer implements IAppContainer {
  public getAuthenticateUser(): IAuthenticateUser {
    return null;
  }

  public getCreateRegistration(): ICreateRegistration {
    return null;
  }

  public getSendGovNotifyEmail(): ISendGovNotifyEmail {
    return null;
  }

  public getAuthGateway(): IAuthGateway {
    return null;
  }

  public getBasicAuthGateway(): IBasicAuthGateway {
    return null;
  }

  public getBeaconsApiGateway(): IBeaconsApiGateway {
    return null;
  }

  public getGovNotifyGateway(): IGovNotifyGateway {
    return null;
  }
}
