import { GetServerSidePropsContext } from "next";
import { cookieSessionId } from "./types";

export const cookieRedirect = (context: GetServerSidePropsContext): void => {
  const cookies = context.req.cookies;

  if (!cookies || !cookies[cookieSessionId]) {
    context.res.writeHead(307, { Location: "/" }).end();
  }
};
