import { AccountHolder } from "../../entities/AccountHolder";
import { Beacon } from "../../entities/Beacon";

export interface AccountHolderGateway {
  createAccountHolder(authId: string, email: string): Promise<AccountHolder>;

  getAccountHolderId(authId: string): Promise<string>;

  getAccountHolderDetails(accountHolderId: string): Promise<AccountHolder>;

  updateAccountHolderDetails(
    accountHolderId: string,
    update: AccountHolder
  ): Promise<AccountHolder>;

  getAccountBeacons(accountHolderId: string): Promise<Beacon[]>;
}
