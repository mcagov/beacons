import { SerializeOptions, serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { acceptRejectCookieId } from "../../lib/types";

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const cookies: Record<string, string> = req.cookies;
  const oneYearFromNow: Date = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (!cookies || !cookies[acceptRejectCookieId]) {
    const options: SerializeOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: oneYearFromNow,
    };

    res.setHeader(
      "Set-Cookie",
      serialize(acceptRejectCookieId, "accepted-cookies", options),
    );
  }

  res.redirect(303, req.headers.referer);
};
