import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { BeaconsSession } from "../../gateways/NextAuthUserSessionGateway";
import { getAppContainer } from "../appContainer";
import { IAppContainer } from "../IAppContainer";

export type BeaconsApiRequest = NextApiRequest & {
  container: Partial<IAppContainer>;
};

export const withApiContainer =
  (callback: NextApiHandler): NextApiHandler =>
  async (req: BeaconsApiRequest, res: NextApiResponse) => {
    if (!req.container) {
      const session = (await getSession({ req })) as BeaconsSession;
      req.container = getAppContainer({ authId: session?.user?.authId });
    }
    return callback(req, res);
  };
