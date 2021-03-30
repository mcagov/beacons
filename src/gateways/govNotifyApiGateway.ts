import { NotifyClient } from "notifications-node-client";

export class GovNotifyGateway {
  api;
  constructor() {
    this.api = new NotifyClient(process.env.GOV_NOTIFY_API_KEY);
  }

  public sendEmail(
    emailTemplateId: string,
    email: string,
    personalisation = {}
  ): boolean {
    for (const key in personalisation) {
      if (typeof personalisation[key] == "undefined") personalisation[key] = "";
    }

    try {
      this.api
        .sendEmail(emailTemplateId, email, {
          personalisation: personalisation,
          reference: personalisation["reference"],
        })
        .catch((err) => {
          return err;
        });

      return true;
    } catch (error) {
      return false;
    }
  }
}
