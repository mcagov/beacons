import { NextApiHandler, NextApiResponse } from "next";
import { BeaconsApiRequest, withApiContainer } from "../../../lib/container";

const handler: NextApiHandler = withApiContainer(
  async (req: BeaconsApiRequest, res: NextApiResponse) => {
    const { deleteCachedUse } = req.container;

    await deleteCachedUse("test-submission-id", 0);
  }
);

export default handler;
