import { DraftRegistration } from "../../../src/entities/DraftRegistration";
import { Environment } from "../../../src/lib/deprecatedRegistration/types";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse } from "../../../src/router/rules/GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse";

describe("GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse", () => {
  describe("condition", () => {
    it("triggers if there is no useIndex query param", async () => {
      const context = {
        req: {
          method: "GET",
        },
        query: {
          whereIsTheUseIndexQueryParam: "itIsMissingOhNo",
        },
      };
      const rule =
        new GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse(
          context as any
        );

      const result = await rule.condition();

      expect(result).toBe(true);
    });

    it("doesn't trigger if there is a useIndex query param", async () => {
      const context = {
        req: {
          method: "GET",
        },
        query: {
          useIndex: "1",
        },
      };
      const rule =
        new GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse(
          context as any
        );

      const result = await rule.condition();

      expect(result).toBe(false);
    });
  });

  describe("action", () => {
    it("when there are existing uses it sends the user to the most recently added use", async () => {
      const draftRegistrationWithUses: DraftRegistration = {
        uses: [
          { environment: Environment.MARITIME },
          { environment: Environment.AVIATION },
        ],
      };
      const context = {
        container: {
          getDraftRegistration: jest
            .fn()
            .mockResolvedValue(draftRegistrationWithUses),
        },
        req: {
          url: "current-page-url",
          cookies: {
            [formSubmissionCookieId]: "test-draft-registration-id",
          },
        },
      };
      const rule =
        new GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse(
          context as any
        );

      const result = await rule.action();

      expect(result).toMatchObject({
        redirect: {
          destination: "current-page-url?useIndex=1",
        },
      });
    });

    it("when there are no uses it creates a new use and sends the user to it", async () => {
      const draftRegistrationNoUses: DraftRegistration = { uses: [] };
      const context = {
        container: {
          getDraftRegistration: jest
            .fn()
            .mockResolvedValue(draftRegistrationNoUses),
          addNewUseToDraftRegistration: jest.fn(),
        },
        req: {
          url: "current-page-url",
          cookies: {
            [formSubmissionCookieId]: "test-draft-registration-id",
          },
        },
      };
      const rule =
        new GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse(
          context as any
        );

      const result = await rule.action();

      expect(
        context.container.addNewUseToDraftRegistration
      ).toHaveBeenCalledWith("test-draft-registration-id");
      expect(result).toMatchObject({
        redirect: {
          destination: "current-page-url?useIndex=0",
        },
      });
    });
  });
});
