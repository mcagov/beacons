import { IncomingMessage } from "http";
import { DraftRegistration } from "../entities/DraftRegistration";
import { AccountHolderGateway } from "../gateways/interfaces/AccountHolderGateway";
import { AuthGateway } from "../gateways/interfaces/AuthGateway";
import { BeaconGateway } from "../gateways/interfaces/BeaconGateway";
import { DraftRegistrationGateway } from "../gateways/interfaces/DraftRegistrationGateway";
import { EmailServiceGateway } from "../gateways/interfaces/EmailServiceGateway";
import { IBasicAuthGateway } from "../gateways/interfaces/IBasicAuthGateway";
import { UserSessionGateway } from "../gateways/interfaces/UserSessionGateway";
import { AddNewUseToDraftRegistrationFn } from "../useCases/addNewUseToDraftRegistration";
import { AuthenticateUserFn } from "../useCases/authenticateUser";
import { ClearCachedRegistrationFn } from "../useCases/clearCachedRegistration";
import { DeleteBeaconFn } from "../useCases/deleteBeacon";
import { DeleteCachedUseFn } from "../useCases/deleteCachedUse";
import { GetAccessTokenFn } from "../useCases/getAccessToken";
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
  beaconsApiAuthGateway: AuthGateway;
  basicAuthGateway: IBasicAuthGateway;
  beaconsApiGateway: BeaconGateway;
  govNotifyGateway: EmailServiceGateway;
  accountHolderApiGateway: AccountHolderGateway;
  sessionGateway: UserSessionGateway;
  draftRegistrationGateway: DraftRegistrationGateway;
}
