import { IAuthenticateUser } from "../useCases/authenticateUser";
import { ICreateRegistration } from "../useCases/createRegistration";
import { ISendGovNotifyEmail } from "../useCases/sendGovNotifyEmail";

export interface IAppContainer {
  getAuthenticateUser: () => IAuthenticateUser;
  getCreateRegistration: () => ICreateRegistration;
  getSendGovNotifyEmail: () => ISendGovNotifyEmail;
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
}
