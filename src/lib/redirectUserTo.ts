import { GetServerSidePropsResult } from "next";

export const redirectUserTo = (
  url: string
): GetServerSidePropsResult<null> => ({
  redirect: {
    destination: url,
    permanent: false,
  },
});
