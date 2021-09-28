import { NotifyClient } from "notifications-node-client";
import { GovNotifyEmailServiceGateway } from "../../src/gateways/GovNotifyEmailServiceGateway";
import logger from "../../src/logger";

jest.mock("notifications-node-client");

describe("GovNotifyEmailServiceGateway", () => {
  let gateway;
  let apiKey;
  let emailTemplateId;
  let email;
  let personalisation;

  beforeEach(() => {
    NotifyClient.mockClear();
    apiKey = "1234-5678-9101";
    gateway = new GovNotifyEmailServiceGateway(apiKey);
    emailTemplateId = "template-id";
    email = "Hello Beacon Person!";
    personalisation = {};
  });

  it("should return true if the email is a success", async () => {
    NotifyClient.mock.instances[0].sendEmail.mockImplementation(() =>
      Promise.resolve(true)
    );
    const result = await gateway.sendEmail(
      emailTemplateId,
      email,
      personalisation
    );
    expect(result).toBe(true);
  });

  it("should return false if the email fails to send", async () => {
    NotifyClient.mock.instances[0].sendEmail.mockImplementation(() => {
      throw new Error("Cannot send email");
    });
    const result = await gateway.sendEmail(
      emailTemplateId,
      email,
      personalisation
    );
    expect(result).toBe(false);
  });

  it("should fail silently with a console log message if the API key is not set", async () => {
    const consoleSpy = jest
      .spyOn(logger, "info")
      .mockImplementationOnce(() => null);

    new GovNotifyEmailServiceGateway(undefined);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
