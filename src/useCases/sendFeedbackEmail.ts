import { EmailServiceGateway } from "../gateways/interfaces/EmailServiceGateway";

//TODO: Maybe restructure and add to the container object
export const sendFeedbackEmail = async (
  emailServiceGateway: EmailServiceGateway,
  //TODO: Properly type feedback
  feedback: any
): Promise<boolean> => {
  // TODO: Use actual template id
  const templateId = process.env.GOV_NOTIFY_FEEDBACK_EMAIL_TEMPLATE;
  // TODO: Use email pulled from environment variables
  const email = process.env.GOV_NOTIFY_FEEDBACK_EMAIL_ADDRESS;

  if (templateId) {
    return emailServiceGateway.sendEmail(templateId, email, {
      referenceId: "junk",
      satisfactionRating: feedback.satisfactionRating,
      howCouldWeImproveThisService: feedback.howCouldWeImproveThisService,
    });
  }

  return false;
};
