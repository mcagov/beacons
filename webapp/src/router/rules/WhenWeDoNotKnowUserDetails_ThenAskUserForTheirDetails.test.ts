import { AccountPageURLs } from "../../../src/lib/urls";
import { WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails } from "../../../src/router/rules/WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails";

describe("WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails", () => {
  it("should route the user to the update account page if the account details are not valid", async () => {
    const mockGetOrCreateAccountHolder = jest.fn().mockReturnValueOnce({});

    const context = {
      session: {},
      container: {
        getOrCreateAccountHolder: mockGetOrCreateAccountHolder,
      },
    };

    const rule = new WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails(
      context as any
    );

    const condition = await rule.condition();
    expect(condition).toBe(true);

    const result = await rule.action();
    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: AccountPageURLs.updateAccount,
      },
    });
  });
});
