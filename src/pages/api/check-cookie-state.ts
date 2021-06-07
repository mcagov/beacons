import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { acceptRejectCookieId } from "../../lib/types";

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const cookies: NextApiRequestCookies = req.cookies;
  const oneYearFromNow: Date = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (!cookies || !cookies[acceptRejectCookieId]) {
    const options: CookieSerializeOptions = {
      path: "/",
      httpOnly: true,
      sameSite: 'lax',
      expires: oneYearFromNow,
    };

    res.setHeader(
      "Set-Cookie",
      serialize(acceptRejectCookieId, "accepted-cookies", options)
    );
  }

  res.redirect(303, req.headers.referer);
};
