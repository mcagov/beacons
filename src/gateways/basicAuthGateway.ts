import { IncomingMessage, ServerResponse } from "http";
import initializeBasicAuth from "nextjs-basic-auth";

export class BasicAuthGateway {
  authenticator;
  constructor() {
    if (process.env.BASIC_AUTH) {
      const credentials = JSON.parse(process.env.BASIC_AUTH);

      this.authenticator = initializeBasicAuth({
        users: credentials,
      });
    }
  }

  async authenticate(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    if (this.authenticator) return await this.authenticator(request, response);
  }
}
