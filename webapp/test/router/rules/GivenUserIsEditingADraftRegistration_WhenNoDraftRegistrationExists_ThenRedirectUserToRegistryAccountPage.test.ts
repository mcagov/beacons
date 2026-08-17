import { IncomingMessage } from "http";
import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../../src/entities/DraftRegistration";
import { IAppContainer } from "../../../src/lib/IAppContainer";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage } from "../../../src/router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage";

describe("GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage", () => {
  describe("condition", () => {
    it("triggers if no cookie exists", async () => {
      const context = {
        req: {
          method: "GET",
          cookies: {
            irrelevant: "theFormSubmissionCookieIdIsMissing!",
          },
        },
      };
      const rule =
        new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage(
          context as any,
        );

      const result = await rule.condition();

      expect(result).toBe(true);
    });

    it("triggers if the cookie exists but there is no DraftRegistration in the cache", async () => {
      const context = {
        req: {
          method: "GET",
          cookies: {
            [formSubmissionCookieId]: "test-draft-registration-id",
          },
        },
        session: { user: { authId: "auth-id" } },
        container: {
          getDraftRegistration: jest.fn().mockResolvedValue(null),
        } as Partial<IAppContainer>,
      };
      const rule =
        new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage(
          context as any,
        );

      const result = await rule.condition();

      expect(result).toBe(true);
    });

    it("doesn't trigger if the cookie exists and there is a DraftRegistration in the cache", async () => {
      const existingDraftRegistration: DraftRegistration = {
        hexId: "1D0E9B07CEFFBFF",
        uses: [],
      };
      const context = {
        req: {
          method: "GET",
          cookies: {
            [formSubmissionCookieId]: "test-draft-registration-id",
          },
        },
        session: { user: { authId: "auth-id" } },
        container: {
          getDraftRegistration: jest
            .fn()
            .mockResolvedValue(existingDraftRegistration),
          saveDraftRegistration: jest.fn(),
        } as Partial<IAppContainer>,
      };
      const rule =
        new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage(
          context as any,
        );

      const result = await rule.condition();

      expect(result).toBe(false);
    });
  });

  describe("action", () => {
    it("when there is no cookie set it redirects the user to the start page", async () => {
      const context = {
        req: {
          method: "GET",
          cookies: {
            irrelevant: "theFormSubmissionCookieIdIsMissing!",
          },
        },
      };
      const rule =
        new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage(
          context as any,
        );

      const result: GetServerSidePropsResult<any> = await rule.action();

      expect(result).toMatchObject({
        redirect: {
          destination: "/account/your-beacon-registry-account",
        },
      });
    });

    it("when there is a cookie set it creates a blank DraftRegistration and reloads the current page", async () => {
      const context = {
        req: {
          url: "current-page-url",
          method: "GET",
          cookies: {
            [formSubmissionCookieId]: "test-draft-registration-id",
          },
        } as Partial<IncomingMessage>,
        session: { user: { authId: "auth-id" } },
        container: {
          saveDraftRegistration: jest.fn(),
          draftRegistrationGateway: {
            read: jest.fn().mockResolvedValue(null),
          },
        } as Partial<IAppContainer>,
      };
      const rule =
        new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage(
          context as any,
        );
      const blankRegistration: DraftRegistration = {
        uses: [],
        ownerAuthId: "auth-id",
      };

      const result: GetServerSidePropsResult<any> = await rule.action();

      expect(context.container.saveDraftRegistration).toHaveBeenCalledWith(
        "test-draft-registration-id",
        blankRegistration,
      );
      expect(result).toMatchObject({
        redirect: {
          destination: "current-page-url",
        },
      });
    });

    it("when a draft exists at, but is not owned by the user, it redirects to the account page without creating or overwriting a draft", async () => {
      const context = {
        req: {
          url: "current-page-url",
          method: "GET",
          cookies: {
            [formSubmissionCookieId]: "owner-auth-id",
          },
        } as Partial<IncomingMessage>,
        session: { user: { authId: "requester-auth-id" } },
        container: {
          saveDraftRegistration: jest.fn(),
          draftRegistrationGateway: {
            read: jest.fn().mockResolvedValue({
              uses: [],
              ownerAuthId: "owner-auth-id",
            }),
          },
        } as Partial<IAppContainer>,
      };
      const rule =
        new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage(
          context as any,
        );

      const result: GetServerSidePropsResult<any> = await rule.action();

      expect(context.container.saveDraftRegistration).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        redirect: {
          destination: "/account/your-beacon-registry-account",
        },
      });
    });
  });
});
