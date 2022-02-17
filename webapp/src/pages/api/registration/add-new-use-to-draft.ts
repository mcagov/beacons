import {
  BeaconsApiRequest,
  withApiContainer,
} from "../../../lib/middleware/withApiContainer";
import { CreateRegistrationPageURLs, queryParams } from "../../../lib/urls";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { addNewUseToDraftRegistration, getDraftRegistration } = req.container;
  const { submissionId } = req.cookies;
  const { nextPage } = req.query;

  await addNewUseToDraftRegistration(submissionId);
  const newUseId = (await getDraftRegistration(submissionId)).uses.length - 1;

  res.redirect(
    nextPage
      ? (nextPage as string)
      : CreateRegistrationPageURLs.environment +
          queryParams({ useId: newUseId })
  );
});

export default handler;
