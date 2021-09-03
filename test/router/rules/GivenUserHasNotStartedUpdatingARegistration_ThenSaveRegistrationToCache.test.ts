import { v4 } from "uuid";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache } from "../../../src/router/rules/GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache";

describe("GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache", () => {
  describe("condition", () => {
    it("will return false if formSubmissionCookieId equals registration id", async () => {
      const registrationId = v4();
      const context = {
        req: {
          method: "GET",
          cookies: {
            [formSubmissionCookieId]: registrationId,
          },
        },
        query: {
          id: registrationId,
        },
      };

      const rule =
        new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
          context as any
        );

      const result = await rule.condition();
      expect(result).toBe(false);
    });

    it("will return true if formSubmissionCookieId doesn't equal the registration id", async () => {
      const registrationId = v4();
      const context = {
        req: {
          method: "GET",
          cookies: {
            [formSubmissionCookieId]: "Not-the-registration-id",
          },
        },
        query: {
          id: registrationId,
        },
      };

      const rule =
        new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
          context as any
        );

      const result = await rule.condition();
      expect(result).toBe(true);
    });

    it("will return true if formSubmissionCookieId is not set", async () => {
      const registrationId = v4();
      const context = {
        req: {
          method: "GET",
          cookies: {},
        },
        query: {
          id: registrationId,
        },
      };

      const rule =
        new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
          context as any
        );

      const result = await rule.condition();
      expect(result).toBe(true);
    });
  });

  describe("action", () => {
    it("Gets registration from the Beacons API", async () => {
      const context: BeaconsGetServerSidePropsContext = {};
    });

    xit("Copies registration to draft registration cache", async () => {
      const registrationId = v4();
      const context: BeaconsGetServerSidePropsContext = {
        container: {
          saveDraftRegistration: jest.fn(),
        },
        query: {
          id: registrationId,
        },
      };

      const rule =
        new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
          context as any
        );
      const result = await rule.action();

      expect(context.container.saveDraftRegistration).toHaveBeenCalledWith(
        registrationId,
        registration
      );
    });
  });
});

// 1. Get existing registration from API (getRegistration())
// 2. Save that registration to Redis (saveDraftRegistration())
