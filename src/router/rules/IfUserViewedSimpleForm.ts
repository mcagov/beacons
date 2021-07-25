import { GetServerSidePropsResult } from "next";
import { withoutErrorMessages } from "../../lib/form/lib";
import { acceptRejectCookieId } from "../../lib/types";
import { SimpleFormRule } from "./SimpleFormRule";

export class IfUserViewedSimpleForm extends SimpleFormRule {
  public async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return {
      props: {
        form: withoutErrorMessages({}, this.validationRules),
        showCookieBanner:
          this.context.req.cookies[acceptRejectCookieId] || true,
        ...(await this.additionalProps),
      },
    };
  }
}
