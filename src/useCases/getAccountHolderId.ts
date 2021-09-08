import { BeaconsSession } from "../gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../lib/IAppContainer";

export type GetAccountHolderIdFn = (session: BeaconsSession) => Promise<string>;

export const getAccountHolderId =
  ({ accountHolderGateway }: IAppContainer) =>
  async (session: BeaconsSession): Promise<string> => {
    const authId: string = session.user.authId;

    return await accountHolderGateway.getAccountHolderId(authId);
  };
