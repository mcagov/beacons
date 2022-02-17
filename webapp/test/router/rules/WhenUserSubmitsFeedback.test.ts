const referenceId = "a-not-so-uuid";
jest.mock("uuid", () => ({ v4: () => referenceId }));

import { FeedbackURLs } from "../../../src/lib/urls";
import { validationRules } from "../../../src/pages/feedback";
import { WhenUserSubmitsFeedback } from "../../../src/router/rules/WhenUserSubmitsFeedback";

describe("WhenUserSubmitsFeedback", () => {
  const templateId = "87dc177e-942f-4484-95ba-18580e937280";
  const email = "not-a-real-email@nope.com";

  beforeAll(() => {
    process.env.GOV_NOTIFY_FEEDBACK_EMAIL_ADDRESS = email;
  });

  it("should route the user to the feedback confirmation page with success if the user successfully submits feedback", async () => {
    const mockSendEmail = jest.fn().mockResolvedValue(true);
    const mockGateway = {
      sendEmail: mockSendEmail,
    };

    const satisfactionRating = "verySatisfied";
    const howCouldWeImproveThisService = "You can't, it's perfect";
    const mockForm = {
      satisfactionRating,
      howCouldWeImproveThisService,
    };
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
    expect(mockSendEmail).toHaveBeenCalledWith(
      templateId,
      email,
      expect.objectContaining({
        satisfactionRating,
        howCouldWeImproveThisService,
        referenceId,
      })
    );
    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: FeedbackURLs.success,
      },
    });
  });

  it("should route the user to the feedback confirmation page with failure if the user failed to submit feedback", async () => {
    const mockSendEmail = jest.fn().mockResolvedValue(false);
    const mockGateway = {
      sendEmail: mockSendEmail,
    };

    const satisfactionRating = "veryDissatisfied";
    const howCouldWeImproveThisService = "You should have used Ruby on Rails";

    const mockForm = {
      satisfactionRating,
      howCouldWeImproveThisService,
    };
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
    expect(mockSendEmail).toHaveBeenCalledWith(
      templateId,
      email,
      expect.objectContaining({
        satisfactionRating,
        howCouldWeImproveThisService,
        referenceId,
      })
    );
    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: FeedbackURLs.failure,
      },
    });
  });
});
