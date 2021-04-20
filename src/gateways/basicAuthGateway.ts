import { IncomingMessage, ServerResponse } from "http";
import basicAuthMiddleware from "nextjs-basic-auth-middleware";

export class BasicAuthGateway {
  async authenticate(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    await basicAuthMiddleware(request, response);
  }
}
