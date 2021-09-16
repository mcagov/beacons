import { BeaconsGetServerSidePropsContext } from "../../../src/lib/middleware/BeaconsGetServerSidePropsContext";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend } from "../../../src/router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend";
import { registrationFixture } from "../../fixtures/registration.fixture";

describe("GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend", () => {
  describe("condition()", () => {
    it("should not trigger if there is no DraftRegistration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        query: {
          registrationId: "registration-id-from-url",
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
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
          context,
          context.query.registrationId as string
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it("should not trigger if there are no changes to the existing DraftRegistration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        query: {
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
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
          context,
          context.query.registrationId as string
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it("should trigger if DraftRegistration is different to the corresponding Registration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
        query: {
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
        },
      } as any;
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
          context,
          context.query.registrationId as string
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(true);
    });
  });

  describe("action()", () => {
    it("sets an edited boolean prop to true", async () => {
      const registrationId = "test-registration-id";
      const context = {
        query: {
          registrationId: registrationId,
        },
        req: {
          cookies: null,
        },
        container: {
          getDraftRegistration: jest.fn(),
        },
      } as any;
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
          context,
          registrationId
        );

      const result = await rule.action();

      expect(result.props.userHasEdited).toBe(true);
    });
  });
});
