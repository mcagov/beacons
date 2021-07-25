import { GetServerSidePropsResult } from "next";
import { isValid } from "../../lib/form/lib";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { SimpleFormRule } from "./SimpleFormRule";

export class IfUserSubmittedValidSimpleForm extends SimpleFormRule {
  public async condition(): Promise<boolean> {
    const form = await this.context.container.parseFormDataAs(this.context.req);

    return (
      this.context.req.method === "POST" && isValid(form, this.validationRules)
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return redirectUserTo(await this.nextPage);
  }
}
