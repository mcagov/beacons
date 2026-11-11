import { v4 as uuidv4 } from "uuid";
import { setCookie } from "../../../lib/middleware";
import {
  BeaconsApiRequest,
  withApiContainer,
} from "../../../lib/middleware/withApiContainer";
import { formSubmissionCookieId } from "../../../lib/types";
import { CreateRegistrationPageURLs } from "../../../lib/urls";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  const { deleteDraftRegistration } = req.container;
  const { submissionId } = req.cookies;
  await deleteDraftRegistration(submissionId);

  setCookie(res, formSubmissionCookieId, uuidv4());

  res.redirect(CreateRegistrationPageURLs.checkBeaconDetails);
});

export default handler;
