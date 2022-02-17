import { ReasonsForDeletingARegistration } from "../../../src/entities/ReasonsForDeletingARegistration";
import { FormManager } from "../../../src/lib/form/FormManager";
import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration } from "../../../src/router/rules/GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration";

describe("GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration", () => {
  describe("action()", () => {
    it("records one of the enumerated reasons for deletion", async () => {
      const userSubmittedFormData = {
        reasonForDeletion: ReasonsForDeletingARegistration.DESTROYED,
        anotherReasonText: "", // Blank string submitted even if user did not select OTHER
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        query: {
          id: "test-registration-id",
        },
        container: {
          getOrCreateAccountHolder: jest
            .fn()
            .mockResolvedValue({ id: "test-account-holder-id" }),
          deleteBeacon: jest.fn().mockResolvedValue({ success: true }),
          parseFormDataAs: jest.fn().mockResolvedValue(userSubmittedFormData),
        },
      };
      const rule =
        new GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration(
          context as any,
          emptyValidationRules
        );

      await rule.action();

      expect(context.container.deleteBeacon).toHaveBeenCalledWith(
        ReasonsForDeletingARegistration.DESTROYED,
        expect.anything(),
        expect.anything()
      );
    });

    it("records the user-provided reason for deletion if OTHER is selected", async () => {
      const userSubmittedFormData = {
        reasonForDeletion: ReasonsForDeletingARegistration.OTHER,
        anotherReasonText: "Lost overboard",
      };
      const context: Partial<BeaconsGetServerSidePropsContext> = {
        query: {
          id: "test-registration-id",
        },
        container: {
          getOrCreateAccountHolder: jest
            .fn()
            .mockResolvedValue({ id: "test-account-holder-id" }),
          deleteBeacon: jest.fn().mockResolvedValue({ success: true }),
          parseFormDataAs: jest.fn().mockResolvedValue(userSubmittedFormData),
        },
      };
      const rule =
        new GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration(
          context as any,
          emptyValidationRules
        );

      await rule.action();

      expect(context.container.deleteBeacon).toHaveBeenCalledWith(
        "Lost overboard",
        expect.anything(),
        expect.anything()
      );
    });
  });
});

export const emptyValidationRules = (): FormManager => {
  return new FormManager({});
};
