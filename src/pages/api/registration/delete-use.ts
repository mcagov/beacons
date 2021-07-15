import { NextApiHandler, NextApiResponse } from "next";
import { BeaconsApiRequest, withApiContainer } from "../../../lib/container";

const handler: NextApiHandler = withApiContainer(
  async (req: BeaconsApiRequest, res: NextApiResponse) => {
    const { deleteCachedUse } = req.container;
    const { useIndex, onSuccess, onFailure } = req.query as {
      [key: string]: string;
    };

    try {
      await deleteCachedUse("test-submission-id", parseInt(useIndex));
    } catch (e) {
      res.redirect(onFailure);
    }

    res.redirect(onSuccess);
  }
);

export default handler;
