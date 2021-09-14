import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend } from "../../../src/router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend";
import { registrationFixture } from "../../fixtures/registration.fixture";

describe("GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend", () => {
  describe("condition()", () => {
    it("should not trigger if there is no DraftRegistration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        query: {
          id: "registration-id-from-url",
        },
        container: {
          getAccountHolderId: jest
            .fn()
            .mockResolvedValue("test-account-holder-id"),
          getDraftRegistration: jest.fn().mockResolvedValue(undefined),
          getAccountHoldersRegistration: jest
            .fn()
            .mockResolvedValue(registrationFixture),
        },
      } as any;
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend(
          context,
          context.query.id as string
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it("should not trigger if there are no changes to the existing DraftRegistration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        query: {
          id: "registration-id-from-url",
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
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend(
          context,
          context.query.id as string
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it("should trigger if DraftRegistration is different to the corresponding Registration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        query: {
          id: "registration-id-from-url",
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
        },
      } as any;
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend(
          context,
          context.query.id as string
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(true);
    });
  });

  describe("action()", () => {
    it("sets an edited boolean prop to true", async () => {
      const context = {
        req: {
          cookies: null,
        },
      } as any;
      const registrationId = "test-registration-id";
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend(
          context,
          registrationId
        );

      const result = await rule.action();

      expect(result.props.userHasEdited).toBe(true);
    });
  });
});
