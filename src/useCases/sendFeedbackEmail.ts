import { v4 as uuidv4 } from "uuid";
import { EmailServiceGateway } from "../gateways/interfaces/EmailServiceGateway";
import { FormSubmission } from "../presenters/formSubmission";

export const sendFeedbackEmail = async (
  emailServiceGateway: EmailServiceGateway,
  feedback: FormSubmission
): Promise<boolean> => {
  const feedbackEmailTemplateId = "87dc177e-942f-4484-95ba-18580e937280";
  const feedbackDestinationEmailAddress =
    process.env.GOV_NOTIFY_FEEDBACK_EMAIL_ADDRESS;

  return emailServiceGateway.sendEmail(
    feedbackEmailTemplateId,
    feedbackDestinationEmailAddress,
    {
      referenceId: uuidv4(),
      satisfactionRating: feedback.satisfactionRating,
      howCouldWeImproveThisService: feedback.howCouldWeImproveThisService,
    }
  );
};
