import { v4 as uuidv4 } from "uuid";
import { EmailServiceGateway } from "../gateways/interfaces/EmailServiceGateway";
import { FormSubmission } from "../presenters/formSubmission";

//TODO: Maybe restructure and add to the container object
export const sendFeedbackEmail = async (
  emailServiceGateway: EmailServiceGateway,
  feedback: FormSubmission
): Promise<boolean> => {
  const templateId = process.env.GOV_NOTIFY_FEEDBACK_EMAIL_TEMPLATE;
  const email = process.env.GOV_NOTIFY_FEEDBACK_EMAIL_ADDRESS;

  if (templateId) {
    return emailServiceGateway.sendEmail(templateId, email, {
      referenceId: uuidv4(),
      satisfactionRating: feedback.satisfactionRating,
      howCouldWeImproveThisService: feedback.howCouldWeImproveThisService,
    });
  }

  return false;
};
