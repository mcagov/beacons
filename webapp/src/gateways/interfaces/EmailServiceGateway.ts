export interface EmailServiceGateway {
  sendEmail: (
    emailTemplateId: string,
    email: string,
    personalisation?: any
  ) => Promise<boolean>;
}
