import { Session } from "../gateways/userSessionGateway";
import { IAppContainer } from "../lib/appContainer";

export const getAccountHolderId =
  ({ getAccessToken, accountHolderApiGateway }: IAppContainer) =>
  async (session: Session): Promise<string> => {
    const authId: string = session.user.authId;
    const accessToken = await getAccessToken();

    return await accountHolderApiGateway.getAccountHolderId(
      authId,
      accessToken
    );
  };
