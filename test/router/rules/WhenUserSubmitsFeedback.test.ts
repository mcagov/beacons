import { FeedbackURLs } from "../../../src/lib/urls";
import { validationRules } from "../../../src/pages/feedback";
import { WhenUserSubmitsFeedback } from "../../../src/router/rules/WhenUserSubmitsFeedback";

describe("WhenUserSubmitsFeedback", () => {
  it("should route the user to the feedback confirmation page with success if the user successfully submits feedback", async () => {
    const mockSendEmail = jest.fn().mockResolvedValue(true);
    const mockGateway = {
      sendEmail: mockSendEmail,
    };

    const mockForm = {};
    const mockParseFormDataAs = jest.fn().mockReturnValueOnce(mockForm);

    const context = {
      container: {
        parseFormDataAs: mockParseFormDataAs,
        emailServiceGateway: mockGateway,
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
        statusCode: 303,
        destination: FeedbackURLs.confirmation + "?success=true",
      },
    });
  });

  it("should route the user to the feedback confirmation page with failure if the user failed to submit feedback", async () => {
    const mockSendEmail = jest.fn().mockResolvedValue(false);
    const mockGateway = {
      sendEmail: mockSendEmail,
    };

    const mockForm = {};
    const mockParseFormDataAs = jest.fn().mockReturnValueOnce(mockForm);

    const context = {
      container: {
        parseFormDataAs: mockParseFormDataAs,
        emailServiceGateway: mockGateway,
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
        statusCode: 303,
        destination: FeedbackURLs.confirmation + "?success=false",
      },
    });
  });
});
