import { IncomingMessage } from "http";
import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../../src/entities/DraftRegistration";
import { IAppContainer } from "../../../src/lib/IAppContainer";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { PageURLs } from "../../../src/lib/urls";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../../src/router/rules/IfUserHasNotStartedEditingADraftRegistration";

describe("IfUserHasNotStartedEditingADraftRegistration", () => {
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
      const rule = new IfUserHasNotStartedEditingADraftRegistration(
        context as any
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
        container: {
          getDraftRegistration: jest.fn().mockResolvedValue(null),
        } as Partial<IAppContainer>,
      };
      const rule = new IfUserHasNotStartedEditingADraftRegistration(
        context as any
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
        container: {
          getDraftRegistration: jest
            .fn()
            .mockResolvedValue(existingDraftRegistration),
          saveDraftRegistration: jest.fn(),
        } as Partial<IAppContainer>,
      };
      const rule = new IfUserHasNotStartedEditingADraftRegistration(
        context as any
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
      const rule = new IfUserHasNotStartedEditingADraftRegistration(
        context as any
      );

      const result: GetServerSidePropsResult<any> = await rule.action();

      expect(result).toMatchObject({
        redirect: {
          destination: PageURLs.start,
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
        container: {
          saveDraftRegistration: jest.fn(),
        } as Partial<IAppContainer>,
      };
      const rule = new IfUserHasNotStartedEditingADraftRegistration(
        context as any
      );
      const blankRegistration: DraftRegistration = {
        uses: [],
      };

      const result: GetServerSidePropsResult<any> = await rule.action();

      expect(context.container.saveDraftRegistration).toHaveBeenCalledWith(
        "test-draft-registration-id",
        blankRegistration
      );
      expect(result).toMatchObject({
        redirect: {
          destination: "current-page-url",
        },
      });
    });
  });
});
