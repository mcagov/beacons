import { IncomingMessage, ServerResponse } from "http";

export interface IBasicAuthGateway {
  authenticate: (
    request: IncomingMessage,
    response: ServerResponse
  ) => Promise<void>;
}
