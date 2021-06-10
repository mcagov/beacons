import { GetServerSidePropsResult, Redirect } from "next";

export interface IRedirectTo {
  execute: (url: string) => GetServerSidePropsResult<Redirect>;
}

export class RedirectTo implements IRedirectTo {
  public execute(url: string): GetServerSidePropsResult<Redirect> {
    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };
  }
}
