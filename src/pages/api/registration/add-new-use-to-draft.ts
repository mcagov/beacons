import { BeaconsApiRequest, withApiContainer } from "../../../lib/container";
import { PageURLs, queryParams } from "../../../lib/urls";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { addNewUseToDraftRegistration, getCachedRegistration } = req.container;
  const { submissionId } = req.cookies;
  const { onSuccess, onFailure } = req.query as {
    [key: string]: string;
  };

  try {
    await addNewUseToDraftRegistration(submissionId);
    const newUseIndex =
      (await getCachedRegistration(submissionId)).getRegistration().uses
        .length - 1;

    res.redirect(
      onSuccess || PageURLs.environment + queryParams({ useIndex: newUseIndex })
    );
  } catch (e) {
    res.redirect(onFailure || PageURLs.serverError);
  }
});

export default handler;
