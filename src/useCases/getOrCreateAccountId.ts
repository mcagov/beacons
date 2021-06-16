import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetOrCreateAccountIdFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<string>;

export const getOrCreateAccountId =
  ({
    getSession,
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetOrCreateAccountIdFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const session = await getSession(context);
    const authId: string = session.user["id"];
    const accessToken = await getAccessToken();

    const getAccountHolderId = async () => {
      try {
        const accountId = await accountHolderApiGateway.getAccountHolderId(
          authId,
          accessToken
        );
        return accountId;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return; // 404 is a-ok
        }
        throw error;
      }
    };

    const createAccountHolderId = async () => {
      const newAccountId = await accountHolderApiGateway.createAccountHolderId(
        authId,
        accessToken
      );
      return newAccountId;
    };

    return (await getAccountHolderId()) ?? (await createAccountHolderId());
  };
