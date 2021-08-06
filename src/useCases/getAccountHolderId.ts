import { BeaconsSession } from "../gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../lib/IAppContainer";

export const getAccountHolderId =
  ({ accountHolderApiGateway }: IAppContainer) =>
  async (session: BeaconsSession): Promise<string> => {
    const authId: string = session.user.authId;

    return await accountHolderApiGateway.getAccountHolderId(authId);
  };
