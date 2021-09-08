import { IncomingMessage } from "http";
import { DraftRegistration } from "../entities/DraftRegistration";
import { AccountHolderGateway } from "../gateways/interfaces/AccountHolderGateway";
import { BeaconGateway } from "../gateways/interfaces/BeaconGateway";
import { DraftRegistrationGateway } from "../gateways/interfaces/DraftRegistrationGateway";
import { EmailServiceGateway } from "../gateways/interfaces/EmailServiceGateway";
import { IBasicAuthGateway } from "../gateways/interfaces/IBasicAuthGateway";
import { UserSessionGateway } from "../gateways/interfaces/UserSessionGateway";
import { AddNewUseToDraftRegistrationFn } from "../useCases/addNewUseToDraftRegistration";
import { AuthenticateUserFn } from "../useCases/authenticateUser";
import { DeleteBeaconFn } from "../useCases/deleteBeacon";
import { DeleteCachedUseFn } from "../useCases/deleteCachedUse";
import { GetAccountHolderIdFn } from "../useCases/getAccountHolderId";
import { GetAccountHoldersRegistrationFn } from "../useCases/getAccountHoldersRegistration";
import { GetBeaconsByAccountHolderIdFn } from "../useCases/getBeaconsByAccountHolderId";
import { GetBeaconsForAccountHolderFn } from "../useCases/getBeaconsForAccountHolder";
import { GetOrCreateAccountHolderFn } from "../useCases/getOrCreateAccountHolder";
import { SendConfirmationEmailFn } from "../useCases/sendConfirmationEmail";
import { SubmitRegistrationFn } from "../useCases/submitRegistration";
import { UpdateAccountHolderFn } from "../useCases/updateAccountHolder";
import { BeaconSearchGateway } from "./../gateways/interfaces/BeaconSearchGateway";

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
  beaconSearchGateway: BeaconSearchGateway;
  emailServiceGateway: EmailServiceGateway;
  accountHolderGateway: AccountHolderGateway;
  draftRegistrationGateway: DraftRegistrationGateway;
  // Other dependencies
  sessionGateway: UserSessionGateway;
  basicAuthGateway: IBasicAuthGateway;
}
