import { GetServerSidePropsResult } from "next";

export const redirectUserTo = (
  url: string
): GetServerSidePropsResult<null> => ({
  redirect: {
    statusCode: 303,
    destination: url,
  },
});
