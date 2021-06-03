export interface IAuthGateway {
  getAccessToken: () => Promise<string>;
}
