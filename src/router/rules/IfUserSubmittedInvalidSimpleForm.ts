import { GetServerSidePropsResult } from "next";
import { isValid, withErrorMessages } from "../../lib/form/lib";
import { acceptRejectCookieId } from "../../lib/types";
import { SimpleFormRule } from "./SimpleFormRule";

export class IfUserSubmittedInvalidSimpleForm extends SimpleFormRule {
  public async condition(): Promise<boolean> {
    const form = await this.context.container.parseFormDataAs(this.context.req);

    return (
      this.context.req.method === "POST" && !isValid(form, this.validationRules)
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const form = await this.context.container.parseFormDataAs(this.context.req);

    return {
      props: {
        form: withErrorMessages(form, this.validationRules),
        showCookieBanner: this.userHasNotHiddenEssentialCookieBanner(),
        ...this.additionalProps,
      },
    };
  }

  private userHasNotHiddenEssentialCookieBanner(): boolean {
    return !this.context.req.cookies[acceptRejectCookieId];
  }
}
