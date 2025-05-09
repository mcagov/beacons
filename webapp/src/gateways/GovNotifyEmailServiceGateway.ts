import { NotifyClient } from "notifications-node-client";
import logger from "../logger";
import { EmailServiceGateway } from "./interfaces/EmailServiceGateway";

export class GovNotifyEmailServiceGateway implements EmailServiceGateway {
  private api;
  constructor(apiKey: string) {
    if (!apiKey) {
      logger.info(
        "GOV_NOTIFY_API_KEY not set on instantiation of GovNotifyEmailServiceGateway.  I'm not going to send any Gov Notify emails.",
      );
    } else {
      this.api = new NotifyClient(apiKey);
    }
  }

  public async sendEmail(
    emailTemplateId: string,
    email: string,
    personalisation = {},
  ): Promise<boolean> {
    for (const key in personalisation) {
      if (typeof personalisation[key] == "undefined") personalisation[key] = "";
    }

    try {
      await this.api.sendEmail(emailTemplateId, email, {
        personalisation: personalisation,
        reference: personalisation["reference"],
      });
      return true;
    } catch (error) {
      logger.error("sendEmail:", error);
      return false;
    }
  }
}
