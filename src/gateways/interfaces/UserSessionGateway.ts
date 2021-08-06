import { CtxOrReq } from "next-auth/client";
import { BeaconsSession } from "../NextAuthUserSessionGateway";

export interface UserSessionGateway {
  getSession: (contextOrRequest: CtxOrReq) => Promise<BeaconsSession | null>;
}
