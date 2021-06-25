import { render } from "@testing-library/react";
import { createResponse } from "node-mocks-http";
import React from "react";
import { IAppContainer } from "../../../src/lib/appContainer";
import { formSubmissionCookieId } from "../../../src/lib/types";
import ApplicationCompletePage, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/application-complete";
import { ISubmitRegistrationResult } from "../../../src/useCases/submitRegistration";

describe("ApplicationCompletePage", () => {
  it("should render correctly", () => {
    render(
      <ApplicationCompletePage pageSubHeading={"Test"} reference={"Test"} />
    );
  });

  describe("getServerSideProps()", () => {
    let mockContainer: Partial<IAppContainer>;
    const mockSubmitRegistration = jest.fn().mockResolvedValue({
      beaconRegistered: true,
      confirmationEmailSent: true,
      registrationNumber: "1AXGFB8",
    });

    beforeEach(() => {
      mockContainer = {
        submitRegistration: mockSubmitRegistration,
      };
    });

    it("should redirect the user to the start page if their form submission cookie isn't set", async () => {
      const context = {
        req: { cookies: {} },
        res: createResponse(),
        container: mockContainer,
      };

      const result = await getServerSideProps(context as any);

      expect(result).toStrictEqual({
        redirect: {
          destination: "/",
          permanent: false,
        },
      });
    });

    it("should attempt to submit the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        res: createResponse(),
        container: mockContainer,
      };

      await getServerSideProps(context as any);

      expect(mockSubmitRegistration).toHaveBeenCalledWith(userRegistrationId);
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
      };
      mockSubmitRegistration.mockResolvedValue(unsuccessful);

      const result = await getServerSideProps(context as any);

      expect(result.props.reference).toBe("");
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
      };
      mockSubmitRegistration.mockResolvedValue(successful);

      const result = await getServerSideProps(context.container)(context);

      expect(result.props.reference).toBe("ABC123");
    });

    it("should have a page heading on success", async () => {
      const successful: ISubmitRegistrationResult = {
        beaconRegistered: true,
        confirmationEmailSent: true,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
      };
      mockSubmitRegistration.mockResolvedValue(successful);

      const result = await getServerSideProps(context as any);

      expect(result.props.pageSubHeading.length).toBeGreaterThan(1);
    });

    it("should have a page heading on failed confirmation email", async () => {
      const failedEmail: ISubmitRegistrationResult = {
        beaconRegistered: true,
        confirmationEmailSent: false,
        referenceNumber: "ABC123",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
      };
      mockSubmitRegistration.mockResolvedValue(failedEmail);

      const result = await getServerSideProps(context as any);

      expect(result.props.pageSubHeading.length).toBeGreaterThan(1);
    });

    it("should have a page heading on failed registration and failed confirmation email", async () => {
      const failedEverything: ISubmitRegistrationResult = {
        beaconRegistered: false,
        confirmationEmailSent: false,
        referenceNumber: "",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        res: createResponse(),
        container: mockContainer,
      };
      mockSubmitRegistration.mockResolvedValue(failedEverything);

      const result = await getServerSideProps(context as any);

      expect(result.props.pageSubHeading.length).toBeGreaterThan(1);
    });

    it("should not throw if there is an error submitting the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        res: createResponse(),
        container: mockContainer,
      };
      mockSubmitRegistration.mockImplementation(() => {
        throw new Error();
      });

      const act = async () => await getServerSideProps(context as any);

      expect(act).not.toThrow();
    });

    it("should feedback to the user if there is an error submitting the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        res: createResponse(),
        container: mockContainer,
      };
      mockSubmitRegistration.mockImplementation(() => {
        throw new Error();
      });

      const result = await getServerSideProps(context as any);

      expect(result.props.pageSubHeading).toMatch(/error/i);
    });
  });
});
