import { AuthGateway } from "./interfaces/AuthGateway";

export class LocalAuthGateway implements AuthGateway {
  public async getAccessToken(): Promise<string> {
    return "local-development-token";
  }
}
