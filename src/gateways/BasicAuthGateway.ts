import { IncomingMessage, ServerResponse } from "http";
import basicAuthMiddleware from "nextjs-basic-auth-middleware";
import { IBasicAuthGateway } from "./interfaces/IBasicAuthGateway";

export class BasicAuthGateway implements IBasicAuthGateway {
  async authenticate(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    await basicAuthMiddleware(request, response);
  }
}
