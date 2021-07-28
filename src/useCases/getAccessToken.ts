import { IAppContainer } from "../lib/IAppContainer";

export type GetAccessTokenFn = () => Promise<string>;

export const getAccessToken =
  ({ beaconsApiAuthGateway }: IAppContainer): GetAccessTokenFn =>
  async () =>
    await beaconsApiAuthGateway.getAccessToken();
