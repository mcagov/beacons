import { getSession } from "next-auth/client";
import { AadAuthGateway, IAuthGateway } from "../gateways/aadAuthGateway";
import {
  AccountHolderApiGateway,
  IAccountHolderApiGateway,
} from "../gateways/accountHolderApiGateway";
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
  IUserSessionGateway,
  UserSessionGateway,
} from "../gateways/userSessionGateway";
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
  getBeaconsByAccountHolderId,
  GetBeaconsByAccountHolderIdFn,
} from "../useCases/getAccountBeacons";
import {
  getAccountHolderId,
  GetAccountHolderIdFn,
} from "../useCases/getAccountHolderId";
import {
  getCachedRegistration,
  GetCachedRegistrationFn,
} from "../useCases/getCachedRegistration";
import {
  getOrCreateAccountHolder,
  GetOrCreateAccountHolderFn,
} from "../useCases/getOrCreateAccountHolder";
import { GetSessionFn } from "../useCases/getSession";
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
  getSession: GetSessionFn;
  getOrCreateAccountHolder: GetOrCreateAccountHolderFn;
  getAccountHolderId: GetAccountHolderIdFn;
  getBeaconsByAccountHolderId: GetBeaconsByAccountHolderIdFn;

  /* Gateways */
  beaconsApiAuthGateway: IAuthGateway;
  basicAuthGateway: IBasicAuthGateway;
  beaconsApiGateway: IBeaconsApiGateway;
  govNotifyGateway: IGovNotifyGateway;
  accountHolderApiGateway: IAccountHolderApiGateway;
  userSessionGateway: IUserSessionGateway;
}

// "overrides" is spread over the default appContainer at the bottom of this method to enable injecting mocks et al.
export const getAppContainer = (overrides?: IAppContainer): IAppContainer => {
  return {
    /* Simple use cases */
    getCachedRegistration: getCachedRegistration,
    clearCachedRegistration: clearCachedRegistration,
    getSession: getSession,

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
    get getOrCreateAccountHolder() {
      return getOrCreateAccountHolder(this);
    },
    get getAccountHolderId() {
      return getAccountHolderId(this);
    },
    get getBeaconsByAccountHolderId() {
      return getBeaconsByAccountHolderId(this);
    },

    /* Gateways */
    get beaconsApiAuthGateway() {
      return new AadAuthGateway();
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
    get accountHolderApiGateway() {
      return new AccountHolderApiGateway(process.env.API_URL);
    },
    get userSessionGateway() {
      return new UserSessionGateway();
    },
    ...overrides,
  };
};

export const appContainer = getAppContainer();
