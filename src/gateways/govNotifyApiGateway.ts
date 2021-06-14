import { NotifyClient } from "notifications-node-client";

export interface IGovNotifyGateway {
  sendEmail: (
    emailTemplateId: string,
    email: string,
    personalisation?: any
  ) => Promise<boolean>;
}

export class GovNotifyGateway implements IGovNotifyGateway {
  private api;
  constructor(apiKey: string) {
    this.api = new NotifyClient(apiKey);
  }

  public async sendEmail(
    emailTemplateId: string,
    email: string,
    personalisation = {}
  ): Promise<boolean> {
    for (const key in personalisation) {
      if (typeof personalisation[key] == "undefined") personalisation[key] = "";
    }

    try {
      await this.api
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
