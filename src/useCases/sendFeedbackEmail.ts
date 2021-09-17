import { EmailServiceGateway } from "../gateways/interfaces/EmailServiceGateway";

//TODO: Maybe restructure and add to the container object
export const sendFeedbackEmail = async (
  emailServiceGateway: EmailServiceGateway,
  //TODO: Properly type feedback
  feedback: any
): Promise<boolean> => {
  // TODO: Use actual template id
  const templateId = "GOV_FEEDBACK_EMAIL";
  // TODO: Use email pulled from environment variables
  const email = "not-a-real-email@absolutelynot.co.nz";

  if (templateId) {
    return emailServiceGateway.sendEmail(templateId, email, {
      satisfactionRating: feedback.satisfactionRating,
      howCouldWeImproveThisService: feedback.howCouldWeImproveThisService,
    });
  }

  return false;
};
