import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteIt } from "../../../src/router/rules/GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteIt";

describe("GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteIt", () => {
  describe("condition", () => {
    it("doesn't trigger if there are no cookies", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {},
        },
      } as any;
      const rule =
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteIt(
          context
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it(`doesn't trigger if the ${formSubmissionCookieId} matches the id to which the user navigated`, async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]:
              "user-is-already-editing-this-draft-registration",
          },
        },
        query: {
          id: "user-is-already-editing-this-draft-registration",
        },
      } as any;
      const rule =
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteIt(
          context
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it(`does trigger if the ${formSubmissionCookieId} is different to the id to which the user navigated`, async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]:
              "user-has-started-doing-something-to-a-draft-registration",
          },
          query: {
            id: "but-is-now-trying-to-do-something-to-a-different-draft-registration",
          },
        },
      } as any;
      const rule =
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteIt(
          context
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(true);
    });
  });
});
