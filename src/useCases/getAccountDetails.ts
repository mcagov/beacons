import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetAccountDetailsFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<IAccountHolderDetails>;

export const getAccountDetails =
  ({ getOrCreateAccount }: IAppContainer): GetAccountDetailsFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    return await getOrCreateAccount(context);
  };
