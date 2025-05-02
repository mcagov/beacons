import { Registration } from "../../src/entities/Registration";
import { sendConfirmationEmail } from "../../src/useCases/sendConfirmationEmail";

describe("sendConfirmationEmail", () => {
  it("should send the email via the injected emailServiceGateway", async () => {
    const registration = {
      model: "ASOS",
    };
    const container = {
      emailServiceGateway: {
        sendEmail: jest.fn().mockImplementation(() => true),
      },
    };
    const email = "beacons@beacons.com";

    const result = await sendConfirmationEmail(container)(
      registration as Registration,
      email
    );

    expect(container.emailServiceGateway.sendEmail).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
});
