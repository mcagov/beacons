import {
  BeaconsApiRequest,
  withApiContainer,
} from "../../../lib/middleware/withApiContainer";
import { CreateRegistrationPageURLs, queryParams } from "../../../lib/urls";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { addNewUseToDraftRegistration, getDraftRegistration } = req.container;
  const { submissionId } = req.cookies;

  await addNewUseToDraftRegistration(submissionId);
  const newUseIndex =
    (await getDraftRegistration(submissionId)).uses.length - 1;

  res.redirect(
    CreateRegistrationPageURLs.environment +
      queryParams({ useIndex: newUseIndex })
  );
});

export default handler;
