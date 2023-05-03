import { IAccountHolder } from "entities/IAccountHolder";
import { IBeacon } from "entities/IBeacon";

export interface IAccountHolderGateway {
  getAccountHolder: (accountHolderId: string) => Promise<IAccountHolder>;
  getBeaconsForAccountHolderId: (accountHolderId: string) => Promise<IBeacon[]>;
}
