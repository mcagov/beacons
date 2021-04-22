import { SendGovNotifyEmail } from "../../src/useCases/sendGovNotifyEmail";

describe("Send Gov Notify Email", () => {
  let gateway;
  let useCase;

  beforeEach(() => {
    gateway = { sendEmail: jest.fn() };
    useCase = new SendGovNotifyEmail(gateway);
  });

  afterEach(() => {
    process.env.GOV_NOTIFY_CUSTOMER_EMAIL_TEMPLATE = undefined;
  });

  it("should not send an email if the gov notify template id is not set", async () => {
    const result = await useCase.execute({});

    expect(gateway.sendEmail).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("should sent the email via gov notify if the template id is set", async () => {
    process.env.GOV_NOTIFY_CUSTOMER_EMAIL_TEMPLATE = "template-id";
    gateway.sendEmail.mockImplementation(() => true);
    useCase = new SendGovNotifyEmail(gateway);
    const result = await useCase.execute({});

    expect(gateway.sendEmail).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
});
