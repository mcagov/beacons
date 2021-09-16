import { GovNotifyEmailServiceGateway } from "../../../src/gateways/GovNotifyEmailServiceGateway";
import { validationRules } from "../../../src/pages/feedback";
import { WhenUserSubmitsFeedback } from "../../../src/router/rules/WhenUserSubmitsFeedback";

describe("WhenUserSubmitsFeedback", () => {
  it("should route the user to the feedback confirmation page with success if the user successfully submits feedback", async () => {
    const mockSendEmail = jest.fn().mockResolvedValue(true);

    jest.mock("../../../src/gateways/GovNotifyEmailServiceGateway", () => {
      return {
        GovNotifyEmailServiceGateway: jest.fn().mockImplementation(() => {
          return {
            sendEmail: mockSendEmail,
          };
        }),
      };
    });

    const mockGovNotifyEmailServiceGateway = new GovNotifyEmailServiceGateway(
      "junk"
    );

    const mockForm = {};
    const mockParseFormDataAs = jest.fn().mockReturnValueOnce(mockForm);

    const context = {
      container: {
        parseFormDataAs: mockParseFormDataAs,
        emailServiceGateway: mockGovNotifyEmailServiceGateway,
      },
      req: {
        method: "POST",
      },
    };

    const rule = new WhenUserSubmitsFeedback(context as any, validationRules);

    const condition = await rule.condition();
    expect(condition).toBe(true);

    const result = await rule.action();
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      redirect: {
        statusCode: 200,
        destination: "/",
      },
    });
  });

  it("should route the user to the feedback confirmation page with failure if the user failed to submit feedback", async () => {
    const mockSendEmail = jest.fn().mockResolvedValue(true);

    jest.mock("../../../src/gateways/GovNotifyEmailServiceGateway", () => {
      return {
        GovNotifyEmailServiceGateway: jest.fn().mockImplementation(() => {
          return {
            sendEmail: mockSendEmail,
          };
        }),
      };
    });

    const mockGovNotifyEmailServiceGateway = new GovNotifyEmailServiceGateway(
      "junk"
    );

    const mockForm = {};
    const mockParseFormDataAs = jest.fn().mockReturnValueOnce(mockForm);
  });
});
