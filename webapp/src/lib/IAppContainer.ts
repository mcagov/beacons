import { IncomingMessage } from "http";
import { DraftRegistration } from "../entities/DraftRegistration";
import { AccountHolderGateway } from "../gateways/interfaces/AccountHolderGateway";
import { BeaconGateway } from "../gateways/interfaces/BeaconGateway";
import { BeaconSearchGateway } from "../gateways/interfaces/BeaconSearchGateway";
import { DraftRegistrationGateway } from "../gateways/interfaces/DraftRegistrationGateway";
import { EmailServiceGateway } from "../gateways/interfaces/EmailServiceGateway";
import { LegacyBeaconGateway } from "../gateways/interfaces/LegacyBeaconGateway";
import { UserSessionGateway } from "../gateways/interfaces/UserSessionGateway";
import { AddNewUseToDraftRegistrationFn } from "../useCases/addNewUseToDraftRegistration";
import { DeleteBeaconFn } from "../useCases/deleteBeacon";
import { DeleteCachedUseFn } from "../useCases/deleteCachedUse";
import { GetAccountHolderIdFn } from "../useCases/getAccountHolderId";
import { GetAccountHoldersRegistrationFn } from "../useCases/getAccountHoldersRegistration";
import { GetBeaconsForAccountHolderFn } from "../useCases/getBeaconsByAccountHolderAndEmail";
import { GetBeaconsByAccountHolderIdFn } from "../useCases/getBeaconsByAccountHolderId";
import { GetOrCreateAccountHolderFn } from "../useCases/getOrCreateAccountHolder";
import { SendConfirmationEmailFn } from "../useCases/sendConfirmationEmail";
import { SubmitRegistrationFn } from "../useCases/submitRegistration";
import { UpdateAccountHolderFn } from "../useCases/updateAccountHolder";
import { UpdateRegistrationFn } from "../useCases/updateRegistration";

export interface IAppContainer {
  /* Use cases */
  submitRegistration: SubmitRegistrationFn;
  sendConfirmationEmail: SendConfirmationEmailFn;
  updateRegistration: UpdateRegistrationFn;

  getDraftRegistration: (id: string) => Promise<DraftRegistration>;
  saveDraftRegistration: (
    id: string,
    updates: DraftRegistration
  ) => Promise<void>;
  deleteDraftRegistration: (id: string) => Promise<void>;
  deleteCachedUse: DeleteCachedUseFn;

  parseFormDataAs<T>(request: IncomingMessage): Promise<T>;

  getOrCreateAccountHolder: GetOrCreateAccountHolderFn;
  updateAccountHolder: UpdateAccountHolderFn;
  getAccountHolderId: GetAccountHolderIdFn;
  getBeaconsByAccountHolderId: GetBeaconsByAccountHolderIdFn;
  getBeaconsForAccountHolder: GetBeaconsForAccountHolderFn;
  getAccountHoldersRegistration: GetAccountHoldersRegistrationFn;
  deleteBeacon: DeleteBeaconFn;
  addNewUseToDraftRegistration: AddNewUseToDraftRegistrationFn;

  /* Gateways */
  // Entities
  beaconGateway: BeaconGateway;
  legacyBeaconGateway: LegacyBeaconGateway;
  beaconSearchGateway: BeaconSearchGateway;
  emailServiceGateway: EmailServiceGateway;
  accountHolderGateway: AccountHolderGateway;
  draftRegistrationGateway: DraftRegistrationGateway;
  // Other dependencies
  sessionGateway: UserSessionGateway;
}
