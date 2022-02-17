import { GetServerSidePropsResult } from "next";
import { showCookieBanner } from "../../lib/cookies";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { Rule } from "./Rule";

export class WhenUserViewsPage_ThenDisplayPage<T> implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly props: T;

  constructor(context: BeaconsGetServerSidePropsContext, props?: T) {
    this.context = context;
    this.props = props;
  }

  public async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return {
      props: {
        showCookieBanner: showCookieBanner(this.context),
        ...(await this.props),
      },
    };
  }
}
