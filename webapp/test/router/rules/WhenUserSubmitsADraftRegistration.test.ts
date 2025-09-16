import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { WhenUserSubmitsADraftRegistration } from "../../../src/router/rules/WhenUserSubmitsADraftRegistration";
import { registrationFixture } from "../../fixtures/registration.fixture";

jest.mock("../../../src/useCases/deleteCachedRegistrationsForAccountHolder");

describe("WhenUserSubmitsADraftRegistration", () => {
  describe("condition()", () => {
    it("doesn't trigger if there are no cookies", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {},
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it(`doesn't trigger if the ${formSubmissionCookieId} exists but is undefined`, async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]: undefined,
          },
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it(`does trigger if the user has completed a draft registration`, async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          method: "GET",
          cookies: {
            [formSubmissionCookieId]:
              "user-has-completed-this-draft-registration",
          },
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      const triggered = await rule.condition();

      expect(triggered).toBe(true);
    });

    it(`doesn't trigger if the user has not completed a draft registration`, async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          method: "GET",
          cookies: {
            [formSubmissionCookieId]:
              "user-has-started-doing-something-to-a-draft-registration",
          },
        },
        params: {
          registrationId: null,
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it("does trigger if the user has updated an existing registration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          method: "POST",
          cookies: {},
        },
        query: {
          registrationId: "registration-id-from-url",
        },
        params: {
          registrationId: "registration-id-from-url",
        },
        container: {
          getAccountHolderId: jest
            .fn()
            .mockResolvedValue("test-account-holder-id"),
          getAccountHoldersRegistration: jest.fn().mockResolvedValue({
            ...registrationFixture,
            ownerFullName: "Steve Stevington", // Existing in Registration
          }),
          getDraftRegistration: jest.fn().mockResolvedValue({
            ...registrationFixture,
            ownerFullName: "Sally Stevington", // Changed in DraftRegistration
          }),
          beaconUpdated: true,
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      const triggered = await rule.condition();

      expect(triggered).toBe(true);
    });

    it("doesn't trigger if the user has not updated an existing registration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          method: "POST",
          cookies: {},
        },
        query: {
          registrationId: "registration-id-from-url",
        },
        params: {
          registrationId: "registration-id-from-url",
        },
        container: {
          getDraftRegistration: jest
            .fn()
            .mockResolvedValue(registrationFixture),
          getAccountHolderId: jest
            .fn()
            .mockResolvedValue("test-account-holder-id"),
          getAccountHoldersRegistration: jest
            .fn()
            .mockResolvedValue(registrationFixture),
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });
  });

  describe("action()", () => {
    it("deletes the existing DraftRegistration", async () => {
      const existingDraftRegistrationId = "a-draft-registration-id";
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]: existingDraftRegistrationId,
          },
        },
        container: {
          deleteDraftRegistration: jest.fn(),
          getAccountHolderId: jest.fn(),
          accountHolderGateway: {
            getAccountBeacons: jest.fn(),
          },
        },
        res: {
          setHeader: jest.fn(),
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      await rule.action();

      expect(context.container.deleteDraftRegistration).toHaveBeenCalledWith(
        existingDraftRegistrationId,
      );
    });

    it("delete the existing DraftRegistration cookie", async () => {
      const existingDraftRegistrationId = "a-draft-registration-id";
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]: existingDraftRegistrationId,
          },
        },
        container: {
          deleteDraftRegistration: jest.fn(),
          getAccountHolderId: jest.fn(),
          accountHolderGateway: {
            getAccountBeacons: jest.fn(),
          },
        },
        res: {
          setHeader: jest.fn(),
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      await rule.action();

      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Set-Cookie",
        expect.stringContaining("submissionId=;"),
      );
    });

    it("reloads the page when deleted", async () => {
      const existingDraftRegistrationId = "a-draft-registration-id";
      const context: BeaconsGetServerSidePropsContext = {
        req: {
          cookies: {
            [formSubmissionCookieId]: existingDraftRegistrationId,
          },
          url: "the-current-page",
        },
        container: {
          deleteDraftRegistration: jest.fn(),
          getAccountHolderId: jest.fn(),
          accountHolderGateway: {
            getAccountBeacons: jest.fn(),
          },
        },
        res: {
          setHeader: jest.fn(),
        },
      } as any;
      const rule = new WhenUserSubmitsADraftRegistration(context);

      const props = (await rule.action()) as any;

      expect(props.redirect.destination).toEqual("the-current-page");
    });
  });
});
