import { isInvalid, withErrorMessages } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { Rule } from "./Rule";

export class WhenUserSubmitsInvalidForm_ThenShowErrors implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;
  private readonly additionalProps: Record<string, any>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    additionalProps?: Record<string, any>
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.additionalProps = additionalProps;
  }

  async condition(): Promise<boolean> {
    return (
      this.context.req.method === "POST" &&
      isInvalid(await this.form(), this.validationRules)
    );
  }

  async action(): Promise<any> {
    return {
      props: {
        form: withErrorMessages(await this.form(), this.validationRules),
        ...(await this.additionalProps),
      },
    };
  }

  private async form(): Promise<any> {
    return await this.context.container.parseFormDataAs(this.context.req);
  }
}
