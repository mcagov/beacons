import { GetServerSidePropsResult } from "next";
import { isValid } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { FormSubmission } from "../../presenters/formSubmission";
import { Rule } from "./Rule";

export class WhenUserSubmitsFeedback implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    this.context = context;
    this.validationRules = validationRules;
  }

  async condition(): Promise<boolean> {
    return this.context.req.method === "POST";
  }

  async action(): Promise<GetServerSidePropsResult<any>> {
    if (await this.formIsValid()) {
      return redirectUserTo("/");
    }
  }

  async form(): Promise<FormSubmission> {
    return await this.context.container.parseFormDataAs(this.context.req);
  }

  private async formIsValid(): Promise<boolean> {
    return isValid(await this.form(), this.validationRules);
  }
}
