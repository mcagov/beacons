import { AccountPageURLs } from "../../../src/lib/urls";
import { WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails } from "../../../src/router/rules/WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails";

describe("WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails", () => {
  it("should route the user to the update account page if the account details are not valid", async () => {
    const mockGetOrCreateAccountHolder = jest.fn().mockReturnValueOnce({});
    const mockHasErrors = jest.fn().mockReturnValueOnce(true);
    const mockAsDirty = jest
      .fn()
      .mockImplementation(() => ({ hasErrors: mockHasErrors }));
    const mockAccountDetailsFormManager = jest
      .fn()
      .mockImplementation(() => ({ asDirty: mockAsDirty }));

    const context = {
      session: {},
      container: {
        getOrCreateAccountHolder: mockGetOrCreateAccountHolder,
      },
    };

    const rule = new WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails(
      context as any,
      mockAccountDetailsFormManager
    );

    const condition = await rule.condition();
    expect(condition).toBe(true);
    expect(mockAccountDetailsFormManager).toHaveBeenCalledTimes(1);

    const result = await rule.action();
    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: AccountPageURLs.updateAccount,
      },
    });
  });

  it("should not trigger if the user has a valid session", async () => {
    const mockGetOrCreateAccountHolder = jest.fn().mockReturnValueOnce({});
    const mockHasErrors = jest.fn().mockReturnValueOnce(false);
    const mockAsDirty = jest
      .fn()
      .mockImplementation(() => ({ hasErrors: mockHasErrors }));
    const mockAccountDetailsFormManager = jest
      .fn()
      .mockImplementation(() => ({ asDirty: mockAsDirty }));

    const context = {
      session: {},
      container: {
        getOrCreateAccountHolder: mockGetOrCreateAccountHolder,
      },
    };

    const rule = new WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails(
      context as any,
      mockAccountDetailsFormManager
    );

    const condition = await rule.condition();
    expect(condition).toBe(false);
  });
});
