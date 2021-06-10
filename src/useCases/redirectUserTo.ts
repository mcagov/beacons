import { GetServerSidePropsResult } from "next";

export interface IRedirectUserTo {
  execute: (url: string) => GetServerSidePropsResult<null>;
}

export class RedirectUserTo implements IRedirectUserTo {
  public execute(url: string): GetServerSidePropsResult<null> {
    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };
  }
}
