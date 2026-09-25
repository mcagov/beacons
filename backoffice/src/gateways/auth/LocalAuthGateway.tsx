import { IAuthGateway } from "./IAuthGateway";

export class LocalAuthGateway implements IAuthGateway {
  public async getAccessToken(): Promise<string> {
    return "local-development-token";
  }
}
