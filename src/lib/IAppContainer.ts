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
import { GetBeaconsByAccountHolderIdFn } from "../useCases/getBeaconsByAccountHolderId";
import { GetOrCreateAccountHolderFn } from "../useCases/getOrCreateAccountHolder";
import { SendConfirmationEmailFn } from "../useCases/sendConfirmationEmail";
import { SubmitRegistrationFn } from "../useCases/submitRegistration";
import { UpdateAccountHolderFn } from "../useCases/updateAccountHolder";

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
  deleteCachedUse: DeleteCachedUseFn;

  parseFormDataAs<T>(request: IncomingMessage): Promise<T>;

  getOrCreateAccountHolder: GetOrCreateAccountHolderFn;
  updateAccountHolder: UpdateAccountHolderFn;
  getAccountHolderId;
  getBeaconsByAccountHolderId: GetBeaconsByAccountHolderIdFn;
  deleteBeacon: DeleteBeaconFn;
  addNewUseToDraftRegistration: AddNewUseToDraftRegistrationFn;

  /* Gateways */
  // Entities
  beaconGateway: BeaconGateway;
  emailServiceGateway: EmailServiceGateway;
  accountHolderGateway: AccountHolderGateway;
  draftRegistrationGateway: DraftRegistrationGateway;
  // Other dependencies
  sessionGateway: UserSessionGateway;
  basicAuthGateway: IBasicAuthGateway;
}
