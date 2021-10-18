import { AadAuthGateway } from "../gateways/AadAuthGateway";
import { BeaconsApiAccountHolderGateway } from "../gateways/BeaconsApiAccountHolderGateway";
import { BeaconsApiBeaconGateway } from "../gateways/BeaconsApiBeaconGateway";
import { BeaconsApiBeaconSearchGateway } from "../gateways/BeaconsApiBeaconSearchGateway";
import { BeaconsApiLegacyBeaconGateway } from "../gateways/BeaconsApiLegacyBeaconGateway";
import { GovNotifyEmailServiceGateway } from "../gateways/GovNotifyEmailServiceGateway";
import { NextAuthUserSessionGateway } from "../gateways/NextAuthUserSessionGateway";
import { RedisDraftRegistrationGateway } from "../gateways/RedisDraftRegistrationGateway";
import { addNewUseToDraftRegistration } from "../useCases/addNewUseToDraftRegistration";
import { deleteBeacon } from "../useCases/deleteBeacon";
import { deleteCachedUse } from "../useCases/deleteCachedUse";
import { deleteDraftRegistration } from "../useCases/deleteDraftRegistration";
import { getAccountHolderId } from "../useCases/getAccountHolderId";
import { getAccountHoldersRegistration } from "../useCases/getAccountHoldersRegistration";
import { getBeaconsForAccountHolder } from "../useCases/getBeaconsByAccountHolderAndEmail";
import { getBeaconsByAccountHolderId } from "../useCases/getBeaconsByAccountHolderId";
import { getDraftRegistration } from "../useCases/getDraftRegistration";
import { getOrCreateAccountHolder } from "../useCases/getOrCreateAccountHolder";
import { saveDraftRegistration } from "../useCases/saveDraftRegistration";
import { sendConfirmationEmail } from "../useCases/sendConfirmationEmail";
import { submitRegistration } from "../useCases/submitRegistration";
import { updateAccountHolder } from "../useCases/updateAccountHolder";
import { updateRegistration } from "../useCases/updateRegistration";
import { IAppContainer } from "./IAppContainer";
import { parseFormDataAs } from "./middleware";

// "overrides" is spread over the default appContainer at the bottom of this method to enable injecting mocks et al.
export const getAppContainer = (overrides?: IAppContainer): IAppContainer => {
  return {
    /* Simple use cases */
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
    get deleteDraftRegistration() {
      return deleteDraftRegistration(this);
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
    get getBeaconsForAccountHolder() {
      return getBeaconsForAccountHolder(this);
    },
    get getAccountHoldersRegistration() {
      return getAccountHoldersRegistration(this);
    },
    get deleteBeacon() {
      return deleteBeacon(this);
    },
    get updateRegistration() {
      return updateRegistration(this);
    },

    /* Gateways */
    get beaconGateway() {
      return new BeaconsApiBeaconGateway(
        process.env.API_URL,
        new AadAuthGateway()
      );
    },
    get beaconSearchGateway() {
      return new BeaconsApiBeaconSearchGateway(
        process.env.API_URL,
        new AadAuthGateway()
      );
    },
    get emailServiceGateway() {
      return new GovNotifyEmailServiceGateway(process.env.GOV_NOTIFY_API_KEY);
    },
    get accountHolderGateway() {
      return new BeaconsApiAccountHolderGateway(
        process.env.API_URL,
        new AadAuthGateway()
      );
    },
    get draftRegistrationGateway() {
      return RedisDraftRegistrationGateway.getGateway();
    },
    get sessionGateway() {
      return new NextAuthUserSessionGateway();
    },
    get legacyBeaconGateway() {
      return new BeaconsApiLegacyBeaconGateway(
        process.env.API_URL,
        new AadAuthGateway()
      );
    },

    /* Mockable utilities */
    parseFormDataAs: parseFormDataAs,

    /* Apply injected overrides */
    ...overrides,
  };
};

export const appContainer = getAppContainer();
