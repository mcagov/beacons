import { BeaconsApiRequest, withApiContainer } from "../../../lib/container";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { deleteCachedUse } = req.container;
  const { submissionId } = req.cookies;
  const { useIndex, onSuccess, onFailure } = req.query as {
    [key: string]: string;
  };

  try {
    await deleteCachedUse(submissionId, parseInt(useIndex));
    res.redirect(303, onSuccess);
  } catch (e) {
    res.redirect(303, onFailure);
  }
});

export default handler;
