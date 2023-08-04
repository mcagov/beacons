import { IAccountHolder } from "entities/IAccountHolder";
import { IAccountHolderSearchResult } from "entities/IAccountHolderSearchResult";
import { IBeacon } from "entities/IBeacon";

export interface IAccountHolderGateway {
  getAccountHolder: (accountHolderId: string) => Promise<IAccountHolder>;
  getBeaconsForAccountHolderId: (accountHolderId: string) => Promise<IBeacon[]>;
  getAllAccountHolders: () => Promise<IAccountHolderSearchResult>;
  updateAccountHolder: (
    accountHolderId: string,
    updatedFields: Partial<IAccountHolder>
  ) => Promise<IAccountHolder>;
  deleteAccountHolder: (accountHolderId: string) => Promise<void>;
}
