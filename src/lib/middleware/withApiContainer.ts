import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { appContainer, IAppContainer } from "../appContainer";

export type BeaconsApiRequest = NextApiRequest & {
  container: Partial<IAppContainer>;
};

export const withApiContainer =
  (callback: NextApiHandler): NextApiHandler =>
  (req: BeaconsApiRequest, res: NextApiResponse) => {
    req.container = req.container || appContainer;
    return callback(req, res);
  };
