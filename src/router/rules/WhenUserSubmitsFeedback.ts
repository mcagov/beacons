import { GetServerSidePropsResult } from "next";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { FeedbackURLs } from "../../lib/urls";
import { FormSubmission } from "../../presenters/formSubmission";
import { sendFeedbackEmail } from "../../useCases/sendFeedbackEmail";
import { Rule } from "./Rule";

//TODO: Currently no validation on the form, may want an error rule at some point
export class WhenUserSubmitsFeedback implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  // Currently unused due to lack of validation
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
    const form = await this.form();
    const success = await this.sendFeedbackEmail(form);

    if (success) {
      return redirectUserTo(FeedbackURLs.success);
    } else {
      return redirectUserTo(FeedbackURLs.failure);
    }
  }

  async form(): Promise<FormSubmission> {
    return await this.context.container.parseFormDataAs(this.context.req);
  }

  // TODO: Properly type feedback
  private async sendFeedbackEmail(feedback: FormSubmission): Promise<boolean> {
    const gateway = this.context.container.emailServiceGateway;
    return sendFeedbackEmail(gateway, feedback);
  }
}
