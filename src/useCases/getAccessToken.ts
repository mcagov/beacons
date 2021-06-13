import { IAppContainer } from "../lib/appContainer";

export type GetAccessTokenFn = () => Promise<string>;

export const getAccessToken = ({
  getAuthGateway,
}: IAppContainer): GetAccessTokenFn => async () =>
  await getAuthGateway().getAccessToken();
