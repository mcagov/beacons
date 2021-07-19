import { BeaconsApiRequest, withApiContainer } from "../../../lib/container";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { deleteCachedUse } = req.container;
  const { submissionId } = req.cookies;
  const { useIndex, onSuccess, onFailure } = req.query as {
    [key: string]: string;
  };

  try {
    await deleteCachedUse(submissionId, parseInt(useIndex));
    res.redirect(onSuccess);
  } catch (e) {
    res.redirect(onFailure);
  }
});

export default handler;
