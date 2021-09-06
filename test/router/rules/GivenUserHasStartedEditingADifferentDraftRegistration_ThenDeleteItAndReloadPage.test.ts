import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage } from "../../../src/router/rules/GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage";

describe("GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage", () => {
  describe("condition()", () => {
    it("doesn't trigger if there are no cookies", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {},
        },
      } as any;
      const rule =
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
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
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
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
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
          context
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(true);
    });
  });

  describe("action()", () => {
    it("deletes the existing DraftRegistration", async () => {
      const existingDraftRegistrationId =
        "a-draft-registration-id-from-a-flow-the-user-is-no-longer-on";
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]: existingDraftRegistrationId,
          },
        },
        container: {
          deleteDraftRegistration: jest.fn(),
        },
      } as any;
      const rule =
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
          context
        );

      await rule.action();

      expect(context.container.deleteDraftRegistration).toHaveBeenCalledWith(
        existingDraftRegistrationId
      );
    });

    it("reloads the page when deleted", async () => {
      const existingDraftRegistrationId =
        "a-draft-registration-id-from-a-flow-the-user-is-no-longer-on";
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]: existingDraftRegistrationId,
          },
          url: "the-current-page",
        },
        container: {
          deleteDraftRegistration: jest.fn(),
        },
      } as any;
      const rule =
        new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
          context
        );

      const props = await rule.action();

      expect(props.redirect.destination).toEqual("the-current-page");
    });
  });
});
