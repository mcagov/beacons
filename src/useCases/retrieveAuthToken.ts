import { IAppContainer } from "../lib/appContainer";

export type RetrieveAuthTokenFn = () => Promise<string>;

export const retrieveAuthToken = ({
  getAuthGateway,
}: IAppContainer): RetrieveAuthTokenFn => async () =>
  await getAuthGateway().getAccessToken();
