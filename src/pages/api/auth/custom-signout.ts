import axios from "axios";
import { NextApiResponse } from "next";
import {
  BeaconsApiRequest,
  withApiContainer,
} from "../../../lib/middleware/withApiContainer";
import { formSubmissionCookieId } from "../../../lib/types";
import { GeneralPageURLs } from "../../../lib/urls";

export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
  await clearLocalSession();
  await clearDraftRegistrationCache(req);
  clearFederatedSession(res);
});

const clearLocalSession = (): Promise<void> =>
  axios.post(`${process.env.NEXTAUTH_URL}/api/auth/signout`);

const clearDraftRegistrationCache = (req: BeaconsApiRequest): Promise<void> =>
  req.container.deleteDraftRegistration(req.cookies[formSubmissionCookieId]);

const clearFederatedSession = (
  res: NextApiResponse<any>,
  postSignoutRedirect = GeneralPageURLs.start
): void => {
  res.redirect(
    `https://${process.env.AZURE_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.AZURE_B2C_LOGIN_FLOW}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.NEXTAUTH_URL}${postSignoutRedirect}`
  );
};

export default handler;
