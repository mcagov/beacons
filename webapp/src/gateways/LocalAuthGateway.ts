import { AuthGateway } from "./interfaces/AuthGateway";

// The service does not verify tokens under the "localauth" profile, but one is still sent so the
// request shape matches a deployed environment.
export class LocalAuthGateway implements AuthGateway {
  public async getAccessToken(): Promise<string> {
    return "local-development-token";
  }
}
