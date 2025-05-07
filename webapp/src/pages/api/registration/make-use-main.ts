import {
  BeaconsApiRequest,
  withApiContainer,
} from "../../../lib/middleware/withApiContainer";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { makeCachedUseMain } = req.container;
  const { submissionId } = req.cookies;
  const { useId, onSuccess, onFailure } = req.query as {
    [key: string]: string;
  };

  try {
    await makeCachedUseMain(submissionId, parseInt(useId));
    res.redirect(onSuccess);
  } catch (e) {
    res.redirect(onFailure);
  }
});

export default handler;
