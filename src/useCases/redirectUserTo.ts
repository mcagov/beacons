import { GetServerSidePropsResult, Redirect } from "next";

export interface IRedirectUserTo {
  execute: (url: string) => GetServerSidePropsResult<Redirect>;
}

export class RedirectUserTo implements IRedirectUserTo {
  public execute(url: string): GetServerSidePropsResult<Redirect> {
    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };
  }
}
