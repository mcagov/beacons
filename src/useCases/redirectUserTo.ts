import { GetServerSidePropsResult } from "next";

export type RedirectUserToFn = (url: string) => GetServerSidePropsResult<null>;

export const redirectUserTo: RedirectUserToFn = (url) => ({
  redirect: {
    destination: url,
    permanent: false,
  },
});
