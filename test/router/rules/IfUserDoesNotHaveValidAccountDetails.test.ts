import { IfUserDoesNotHaveValidAccountDetails } from "../../../src/router/rules/IfUserDoesNotHaveValidAccountDetails";

describe("IfUserDoesNotHaveValidAccountDetails", () => {
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

    const rule = new IfUserDoesNotHaveValidAccountDetails(
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

    const rule = new IfUserDoesNotHaveValidAccountDetails(
      context as any,
      mockAccountDetailsFormManager
    );

    const condition = await rule.condition();
    expect(condition).toBe(false);
  });
});
