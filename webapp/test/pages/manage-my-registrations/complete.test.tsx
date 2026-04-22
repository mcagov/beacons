/**
 * @jest-environment jsdom
 */

import { setImmediate } from "timers";
import { render } from "@testing-library/react";
import { createResponse } from "node-mocks-http";
import React from "react";
import { DraftRegistration } from "../../../src/entities/DraftRegistration";
import { IAppContainer } from "../../../src/lib/IAppContainer";
import { formSubmissionCookieId } from "../../../src/lib/types";
import CompletePage, {
  getServerSideProps,
} from "../../../src/pages/manage-my-registrations/[registrationId]/update/complete";
import { IUpdateRegistrationResult } from "../../../src/useCases/updateRegistration";

global.setImmediate = setImmediate;

describe("CompletePage", () => {
  it("should render correctly", () => {
    render(<CompletePage updateSuccess={true} reference="Test" />);
  });

  describe("getServerSideProps()", () => {
    const mockDraftRegistration: DraftRegistration = {
      id: "draft-registration-id",
      hexId: "draft-registration-hexId",
      model: "ASOS",
      uses: [],
    };

    const mockSessionGateway = {
      getSession: jest
        .fn()
        .mockReturnValue({ user: { authId: "test-auth-id" } }),
    };

    let mockContainer: Partial<IAppContainer>;

    const mockUpdateRegistration = jest.fn().mockResolvedValue({
      beaconUpdated: true,
      registrationNumber: "1AXGFB8",
    });

    beforeEach(() => {
      mockContainer = {
        updateRegistration: mockUpdateRegistration,
        getAccountHolderId: jest.fn().mockResolvedValue("account-holder-id"),
        getDraftRegistration: jest
          .fn()
          .mockResolvedValue(mockDraftRegistration),
        sessionGateway: mockSessionGateway,
        deleteDraftRegistration: jest.fn(),
      };
    });

    it("should redirect the user to your account home page if their form submission cookie isn't set", async () => {
      const context = {
        req: { cookies: {} },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };

      const result = await getServerSideProps(context as any);

      expect(result).toMatchObject({
        redirect: {
          destination: "/account/your-beacon-registry-account",
        },
      });
    });

    it("should attempt to update the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };

      await getServerSideProps(context as any);

      expect(mockUpdateRegistration).toHaveBeenCalledWith(
        expect.objectContaining(mockDraftRegistration),
        mockDraftRegistration.id,
      );
    });

    it("should return a reference number if updating the registration is unsuccessful", async () => {
      const unsuccessful: IUpdateRegistrationResult = {
        beaconUpdated: false,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockUpdateRegistration.mockResolvedValue(unsuccessful);

      const result = await getServerSideProps(context as any);

      expect(result["props"].reference).toBe("ABC123");
    });

    it("should return a reference number if updating the registration is successful", async () => {
      const successful: IUpdateRegistrationResult = {
        beaconUpdated: true,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockUpdateRegistration.mockResolvedValue(successful);

      const result = await getServerSideProps(context as any);

      expect(result["props"].reference).toBe("ABC123");
    });

    it("When the registration succeeded, then the updateSuccess boolean should be true", async () => {
      const successful: IUpdateRegistrationResult = {
        beaconUpdated: true,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockUpdateRegistration.mockResolvedValue(successful);

      const result = await getServerSideProps(context as any);

      expect(result["props"].updateSuccess).toBe(true);
    });

    it("should not throw if there is an error updating the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        res: createResponse(),
        container: mockContainer,
        session: { user: { authId: "a-session-id" } },
      };
      mockUpdateRegistration.mockImplementation(() => {
        throw new Error();
      });

      const act = async () => await getServerSideProps(context as any);

      expect(act).not.toThrow();
    });
  });
});
