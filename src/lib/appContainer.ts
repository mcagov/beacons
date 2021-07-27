import { IncomingMessage } from "http";
import { DraftRegistration } from "../entities/DraftRegistration";
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
import { DraftRegistrationGateway } from "../gateways/DraftRegistrationGateway";
import {
  GovNotifyGateway,
  IGovNotifyGateway,
} from "../gateways/govNotifyApiGateway";
import { RedisDraftRegistrationGateway } from "../gateways/RedisDraftRegistrationGateway";
import {
  IUserSessionGateway,
  UserSessionGateway,
} from "../gateways/userSessionGateway";
import {
  addNewUseToDraftRegistration,
  AddNewUseToDraftRegistrationFn,
} from "../useCases/addNewUseToDraftRegistration";
import {
  authenticateUser,
  AuthenticateUserFn,
} from "../useCases/authenticateUser";
import {
  clearCachedRegistration,
  ClearCachedRegistrationFn,
} from "../useCases/clearCachedRegistration";
import { deleteBeacon, DeleteBeaconFn } from "../useCases/deleteBeacon";
import {
  deleteCachedUse,
  DeleteCachedUseFn,
} from "../useCases/deleteCachedUse";
import { getAccessToken, GetAccessTokenFn } from "../useCases/getAccessToken";
import {
  getBeaconsByAccountHolderId,
  GetBeaconsByAccountHolderIdFn,
} from "../useCases/getAccountBeacons";
import { getAccountHolderId } from "../useCases/getAccountHolderId";
import { getDraftRegistration } from "../useCases/getDraftRegistration";
import {
  getOrCreateAccountHolder,
  GetOrCreateAccountHolderFn,
} from "../useCases/getOrCreateAccountHolder";
import { saveDraftRegistration } from "../useCases/saveDraftRegistration";
import {
  sendConfirmationEmail,
  SendConfirmationEmailFn,
} from "../useCases/sendConfirmationEmail";
import {
  submitRegistration,
  SubmitRegistrationFn,
} from "../useCases/submitRegistration";
import {
  updateAccountHolder,
  UpdateAccountHolderFn,
} from "../useCases/updateAccountHolder";
import { parseFormDataAs } from "./middleware";

export interface IAppContainer {
  /* Use cases */
  authenticateUser: AuthenticateUserFn;
  submitRegistration: SubmitRegistrationFn;
  sendConfirmationEmail: SendConfirmationEmailFn;
  getDraftRegistration: (id: string) => Promise<DraftRegistration>;
  saveDraftRegistration: (
    id: string,
    updates: DraftRegistration
  ) => Promise<void>;
  clearCachedRegistration: ClearCachedRegistrationFn;
  deleteCachedUse: DeleteCachedUseFn;
  getAccessToken: GetAccessTokenFn;
  parseFormDataAs<T>(request: IncomingMessage): Promise<T>;
  getOrCreateAccountHolder: GetOrCreateAccountHolderFn;
  updateAccountHolder: UpdateAccountHolderFn;
  getAccountHolderId;
  getBeaconsByAccountHolderId: GetBeaconsByAccountHolderIdFn;
  deleteBeacon: DeleteBeaconFn;
  addNewUseToDraftRegistration: AddNewUseToDraftRegistrationFn;

  /* Gateways */
  beaconsApiAuthGateway: IAuthGateway;
  basicAuthGateway: IBasicAuthGateway;
  beaconsApiGateway: IBeaconsApiGateway;
  govNotifyGateway: IGovNotifyGateway;
  accountHolderApiGateway: IAccountHolderApiGateway;
  userSessionGateway: IUserSessionGateway;
  draftRegistrationGateway: DraftRegistrationGateway;
}

// "overrides" is spread over the default appContainer at the bottom of this method to enable injecting mocks et al.
export const getAppContainer = (overrides?: IAppContainer): IAppContainer => {
  return {
    /* Simple use cases */
    clearCachedRegistration: clearCachedRegistration,
    deleteCachedUse: deleteCachedUse,

    /* Composite use cases requiring access to other use cases */
    get getDraftRegistration() {
      return getDraftRegistration(this);
    },
    get addNewUseToDraftRegistration() {
      return addNewUseToDraftRegistration(this);
    },
    get saveDraftRegistration() {
      return saveDraftRegistration(this);
    },
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
    get updateAccountHolder() {
      return updateAccountHolder(this);
    },
    get getAccountHolderId() {
      return getAccountHolderId(this);
    },
    get getBeaconsByAccountHolderId() {
      return getBeaconsByAccountHolderId(this);
    },
    get deleteBeacon() {
      return deleteBeacon(this);
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
    get draftRegistrationGateway() {
      return new RedisDraftRegistrationGateway();
    },

    /* Mockable utilities */
    parseFormDataAs: parseFormDataAs,

    /* Apply injected overrides */
    ...overrides,
  };
};

export const appContainer = getAppContainer();
