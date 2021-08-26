import { GetServerSidePropsResult } from "next";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { PageURLs } from "../../lib/urls";
import { Rule } from "./Rule";

export class IfUserDoesNotHaveValidSession implements Rule {
  constructor(private readonly context: BeaconsGetServerSidePropsContext) {}

  public async condition(): Promise<boolean> {
    const session = await this.context.container.sessionGateway.getSession(
      this.context
    );

    return session == null;
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return redirectUserTo(PageURLs.signUpOrSignIn);
  }
}
