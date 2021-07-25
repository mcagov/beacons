import { UserViewedBeaconUseFormWithoutUseIndexRule } from "../../../src/router/rules/UserViewedBeaconUseFormWithoutUseIndexRule";

describe("UserViewedDraftRegistrationFormRule", () => {
  it("triggers if the useIndex query param is missing", async () => {
    const context = {
      req: {
        method: "GET",
      },
      query: {
        anIrrelevantQueryParam: "notice-how-useIndex-is-missing?",
      },
    };
    const rule = new UserViewedBeaconUseFormWithoutUseIndexRule(context as any);

    const result = await rule.condition();

    expect(result).toBe(true);
  });

  it("does not trigger if the useIndex query param is present", async () => {
    const context = {
      req: {
        method: "GET",
      },
      query: {
        useIndex: "ah-there-it-is!",
      },
    };
    const rule = new UserViewedBeaconUseFormWithoutUseIndexRule(context as any);

    const result = await rule.condition();

    expect(result).toBe(false);
  });
});
