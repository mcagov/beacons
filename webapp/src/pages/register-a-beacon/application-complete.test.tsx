/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import { createResponse } from "node-mocks-http";
import React from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { IAppContainer } from "../../lib/IAppContainer";
import { formSubmissionCookieId } from "../../lib/types";
import ApplicationCompletePage, {
  getServerSideProps,
} from "./application-complete";
import { ISubmitRegistrationResult } from "../../useCases/submitRegistration";

describe("ApplicationCompletePage", () => {
  it("should render correctly", () => {
    render(
      <ApplicationCompletePage
        registrationSuccess={true}
        confirmationEmailSuccess={true}
        reference="Test"
      />
    );
  });

  describe("getServerSideProps()", () => {
    const mockDraftRegistration: DraftRegistration = {
      model: "ASOS",
      uses: [],
    };

    const mockSessionGateway = {
      getSession: jest
        .fn()
        .mockReturnValue({ user: { authId: "test-auth-id" } }),
    };

    let mockContainer: Partial<IAppContainer>;

    const mockSubmitRegistration = jest.fn().mockResolvedValue({
      beaconRegistered: true,
      confirmationEmailSent: true,
      registrationNumber: "1AXGFB8",
    });

    beforeEach(() => {
      mockContainer = {
        submitRegistration: mockSubmitRegistration,
        getAccountHolderId: jest.fn().mockResolvedValue("account-holder-id"),
        getDraftRegistration: jest
          .fn()
          .mockResolvedValue(mockDraftRegistration),
        sessionGateway: mockSessionGateway,
      };
    });

    it("should redirect the user to the start page if their form submission cookie isn't set", async () => {
      const context = {
        req: { cookies: {} },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };

      const result = await getServerSideProps(context as any);

      expect(result).toMatchObject({
        redirect: {
          destination: "/",
        },
      });
    });

    it("should attempt to submit the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const accountHolderId = "account-holder-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };

      await getServerSideProps(context as any);

      expect(mockSubmitRegistration).toHaveBeenCalledWith(
        expect.objectContaining(mockDraftRegistration),
        accountHolderId
      );
    });

    it("should not return a reference number if creating the registration is unsuccessful", async () => {
      const unsuccessful: ISubmitRegistrationResult = {
        beaconRegistered: false,
        confirmationEmailSent: false,
        referenceNumber: "",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockSubmitRegistration.mockResolvedValue(unsuccessful);

      const result = await getServerSideProps(context as any);

      expect(result["props"].reference).toBeUndefined();
    });

    it("should return a reference number if creating the registration is successful", async () => {
      const successful: ISubmitRegistrationResult = {
        beaconRegistered: true,
        confirmationEmailSent: true,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockSubmitRegistration.mockResolvedValue(successful);

      const result = await getServerSideProps(context as any);

      expect(result["props"].reference).toBe("ABC123");
    });

    it("When the registration succeeded, then the registrationSuccess boolean should be true", async () => {
      const successful: ISubmitRegistrationResult = {
        beaconRegistered: true,
        confirmationEmailSent: true,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockSubmitRegistration.mockResolvedValue(successful);

      const result = await getServerSideProps(context as any);

      expect(result["props"].registrationSuccess).toBe(true);
    });

    it("When the registration succeeded but the confirmation email failed to send, then the confirmationEmailSent boolean should be false", async () => {
      const failedEmail: ISubmitRegistrationResult = {
        beaconRegistered: true,
        confirmationEmailSent: false,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockSubmitRegistration.mockResolvedValue(failedEmail);

      const result = await getServerSideProps(context as any);

      expect(result["props"].confirmationEmailSuccess).toBe(false);
    });

    it("When both registration and confirmation email fail, then both confirmationEmailSuccess and registrationSuccess should be false", async () => {
      const failedEverything: ISubmitRegistrationResult = {
        beaconRegistered: false,
        confirmationEmailSent: false,
        referenceNumber: "",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockSubmitRegistration.mockResolvedValue(failedEverything);

      const result = await getServerSideProps(context as any);

      expect(result["props"].registrationSuccess).toBe(false);
      expect(result["props"].confirmationEmailSuccess).toBe(false);
    });

    it("should not throw if there is an error submitting the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockSubmitRegistration.mockImplementation(() => {
        throw new Error();
      });

      const act = async () => await getServerSideProps(context as any);

      expect(act).not.toThrow();
    });
  });
});
