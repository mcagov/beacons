import { AccountHolder } from "../entities/AccountHolder";
import { Beacon } from "../entities/Beacon";

export interface AccountHolderGateway {
  createAccountHolder(
    authId: string,
    email: string,
    accessToken: string
  ): Promise<AccountHolder>;

  getAccountHolderId(authId: string, accessToken: string): Promise<string>;

  getAccountHolderDetails(
    accountHolderId: string,
    accessToken: string
  ): Promise<AccountHolder>;

  updateAccountHolderDetails(
    accountHolderId: string,
    update: AccountHolder,
    accessToken: string
  ): Promise<AccountHolder>;

  getAccountBeacons(
    accountHolderId: string,
    accessToken: string
  ): Promise<Beacon[]>;
}
