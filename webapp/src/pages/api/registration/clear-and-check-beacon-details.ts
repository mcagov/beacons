import {
  BeaconsApiRequest,
  withApiContainer,
} from "../../../lib/middleware/withApiContainer";
import { CreateRegistrationPageURLs } from "../../../lib/urls";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { deleteDraftRegistration } = req.container;
  const { submissionId } = req.cookies;
  await deleteDraftRegistration(submissionId);

  res.redirect(CreateRegistrationPageURLs.checkBeaconDetails);
});

export default handler;
