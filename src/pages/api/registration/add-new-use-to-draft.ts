import { BeaconsApiRequest, withApiContainer } from "../../../lib/container";
import { PageURLs, queryParams } from "../../../lib/urls";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { addNewUseToDraftRegistration, getCachedRegistration } = req.container;
  const { submissionId } = req.cookies;

  await addNewUseToDraftRegistration(submissionId);
  const newUseIndex =
    (await getCachedRegistration(submissionId)).getRegistration().uses.length -
    1;

  res.redirect(PageURLs.environment + queryParams({ useIndex: newUseIndex }));
});

export default handler;
