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
        params: {
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
          context.query.registrationId as string,
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it("should not trigger if there are no changes to the existing DraftRegistration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
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
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
          context,
          context.query.registrationId as string,
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(false);
    });

    it("should trigger if DraftRegistration is different to the corresponding Registration", async () => {
      const context: BeaconsGetServerSidePropsContext = {
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
        },
      } as any;
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
          context,
          context.query.registrationId as string,
        );

      const triggered = await rule.condition();

      expect(triggered).toBe(true);
    });
  });

  describe("action()", () => {
    it("sets userHasEdited to true and uses dates from the live registration", async () => {
      const registrationId = "test-registration-id";
      const context = {
        query: { registrationId },
        params: { registrationId },
        req: { cookies: null },
        session: {},
        container: {
          getDraftRegistration: jest.fn().mockResolvedValue({
            ...registrationFixture,
            ownerFullName: "Sally Stevington",
          }),
          getAccountHolderId: jest
            .fn()
            .mockResolvedValue("test-account-holder-id"),
          getAccountHoldersRegistration: jest.fn().mockResolvedValue({
            ...registrationFixture,
            ownerFullName: "Steve Stevington",
            registeredDate: "2021-11-04",
            lastModifiedDate: "2026-11-05",
          }),
        },
      } as any;
      const rule =
        new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
          context,
          registrationId,
        );

      await rule.condition();
      const result = (await rule.action()) as any;

      expect(result.props.userHasEdited).toBe(true);
      expect(result.props.registration.registeredDate).toBe("2021-11-04");
      expect(result.props.registration.lastModifiedDate).toBe("2026-11-05");
    });
  });
});
