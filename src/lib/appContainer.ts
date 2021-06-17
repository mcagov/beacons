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
  authenticateUser,
  AuthenticateUserFn,
} from "../useCases/authenticateUser";
import {
  clearCachedRegistration,
  ClearCachedRegistrationFn,
} from "../useCases/clearCachedRegistration";
import { getAccessToken, GetAccessTokenFn } from "../useCases/getAccessToken";
import {
  getAccountBeacons,
  GetAccountBeaconsFn,
} from "../useCases/getAccountBeacons";
import {
  getAccountDetails,
  GetAccountDetailsFn,
} from "../useCases/getAccountDetails";
import {
  getCachedRegistration,
  GetCachedRegistrationFn,
} from "../useCases/getCachedRegistration";
import {
  getOrCreateAccountId,
  GetOrCreateAccountIdFn,
} from "../useCases/getOrCreateAccountId";
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
  getAccountDetails: GetAccountDetailsFn;
  getOrCreateAccountId: GetOrCreateAccountIdFn;
  getAccountBeacons: GetAccountBeaconsFn;

  /* Gateways */
  beaconsApiAuthGateway: IAuthGateway;
  basicAuthGateway: IBasicAuthGateway;
  beaconsApiGateway: IBeaconsApiGateway;
  govNotifyGateway: IGovNotifyGateway;
  accountHolderApiGateway: IAccountHolderApiGateway;
}

export const appContainer: IAppContainer = {
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
  get getAccountDetails() {
    return getAccountDetails(this);
  },
  get getOrCreateAccountId() {
    return getOrCreateAccountId(this);
  },
  get getAccountBeacons() {
    return getAccountBeacons(this);
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
};
