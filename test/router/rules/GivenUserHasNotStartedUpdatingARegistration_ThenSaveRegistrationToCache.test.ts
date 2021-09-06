import { v4 } from "uuid";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache } from "../../../src/router/rules/GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache";
import { registrationFixture } from "../../fixtures/registration.fixture";

describe("GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache", () => {
  describe("condition", () => {
    it("will return false if formSubmissionCookieId equals registration id", async () => {
      const registrationId = v4();
      const context = {
        req: {
          method: "GET",
          url: "page-url",
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
          url: "page-url",
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
          url: "page-url",
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
    it("gets the existing Registration from getAccountHoldersRegistration", async () => {
      const registration = {
        ...registrationFixture,
        id: v4(),
        accountHolderId: v4(),
      };
      const context: BeaconsGetServerSidePropsContext = {
        container: {
          getAccountHolderId: jest
            .fn()
            .mockResolvedValue(registration.accountHolderId),
          getAccountHoldersRegistration: jest
            .fn()
            .mockResolvedValue(registration),
          saveDraftRegistration: jest.fn(),
        },
        query: {
          id: registration.id,
        },
        req: {
          url: "page-url",
        },
      } as any;
      const rule =
        new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
          context as any
        );

      await rule.action();

      expect(
        context.container.getAccountHoldersRegistration
      ).toHaveBeenCalledWith(registration.id, registration.accountHolderId);
    });

    it("saves the Registration to the DraftRegistration cache", async () => {
      const registration = {
        ...registrationFixture,
        id: v4(),
        accountHolderId: v4(),
      };
      const context: BeaconsGetServerSidePropsContext = {
        container: {
          getAccountHolderId: jest
            .fn()
            .mockResolvedValue(registration.accountHolderId),
          getAccountHoldersRegistration: jest
            .fn()
            .mockResolvedValue(registration),
          saveDraftRegistration: jest.fn(),
        },
        query: {
          id: registration.id,
        },
        req: {
          url: "page-url",
        },
      } as any;
      const rule =
        new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
          context as any
        );

      await rule.action();

      expect(context.container.saveDraftRegistration).toHaveBeenCalledWith(
        registration.id,
        registration
      );
    });

    it("reloads same page once DraftRegistration has been saved to cache", async () => {
      const registration = {
        id: v4(),
      };
      const context: BeaconsGetServerSidePropsContext = {
        container: {
          getAccountHolderId: jest.fn(),
          getAccountHoldersRegistration: jest.fn(),
          saveDraftRegistration: jest.fn(),
        },
        query: {
          id: registration.id,
        },
        req: {
          url: "page-url",
        },
      } as any;
      const rule =
        new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
          context as any
        );

      const props = await rule.action();

      expect(props).toMatchObject({
        redirect: {
          statusCode: 303,
          destination: context.req.url,
        },
      });
    });
  });
});
