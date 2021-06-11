import { render } from "@testing-library/react";
import React from "react";
import { IAppContainer } from "../../../src/lib/appContainer";
import { formSubmissionCookieId } from "../../../src/lib/types";
import ApplicationCompletePage, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/application-complete";
import { redirectUserTo } from "../../../src/useCases/redirectUserTo";
import { retrieveUserFormSubmissionId } from "../../../src/useCases/retrieveUserFormSubmissionId";
import { ISubmitRegistrationResult } from "../../../src/useCases/submitRegistration";
import { verifyFormSubmissionCookieIsSet } from "../../../src/useCases/verifyFormSubmissionCookieIsSet";

jest.mock("../../../src/lib/middleware", () => ({
  _esModule: true,
  decorateGetServerSidePropsContext: jest.fn(() => ({
    registration: {
      getRegistration: jest.fn().mockResolvedValue({
        referenceNumber: "",
      }),
    },
  })),
  clearFormCache: jest.fn(),
  clearFormSubmissionCookie: jest.fn(),
}));

describe("ApplicationCompletePage", () => {
  it("should render correctly", () => {
    render(
      <ApplicationCompletePage pageSubHeading={"Test"} reference={"Test"} />
    );
  });

  describe("getServerSideProps function", () => {
    let mockContainer: Partial<IAppContainer>;
    const mockSubmitRegistration = jest.fn();

    beforeEach(() => {
      mockContainer = {
        getVerifyFormSubmissionCookieIsSet: () =>
          verifyFormSubmissionCookieIsSet, // Don't mock; pure function
        getRedirectUserTo: () => redirectUserTo, // Don't mock; pure function
        getRetrieveUserFormSubmissionId: () => retrieveUserFormSubmissionId, // Don't mock; pure function
        getSubmitRegistration: () => mockSubmitRegistration, // Do mock; this has side-effects
      };
    });

    it("should redirect the user to the start page if their form submission cookie isn't set", async () => {
      const context = {
        req: { cookies: {} },
        container: mockContainer,
      };

      const result = await getServerSideProps(context);

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
        container: mockContainer,
      };

      await getServerSideProps(context);

      expect(mockSubmitRegistration).toHaveBeenCalledWith(userRegistrationId);
    });

    it("should not have a reference number if creating the registration is unsuccessful", async () => {
      const registrationOutcome: ISubmitRegistrationResult = {
        beaconRegistered: false,
        confirmationEmailSent: false,
        registrationNumber: "",
      };
      const context = {
        req: { cookies: { [formSubmissionCookieId]: "test-cookie-uuid" } },
        container: mockContainer,
      };

      const result = await getServerSideProps(context);

      expect(result.props.reference).toBe("");
    });

    it("should create the registration, send the email via gov notify and return the reference number", async () => {
      mockVerifyFormSubmissionCookieIsSet.mockReturnValue(true);
      mockSubmitRegistration.mockResolvedValue(true);
      mockSendGovNotifyEmail.mockResolvedValue(true);

      const result = await getServerSideProps(context);

      expect(result.props.reference.length).toBe(7);
      expect(mockSubmitRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).toHaveBeenCalled();
    });

    it("should create the registration, and return the reference number if the email cannot be sent", async () => {
      mockVerifyFormSubmissionCookieIsSet.mockReturnValue(true);
      mockSubmitRegistration.mockResolvedValue(true);
      mockSendGovNotifyEmail.mockResolvedValue(false);

      const result = await getServerSideProps(context);

      expect(result.props.reference.length).toBe(7);
      expect(mockSubmitRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).toHaveBeenCalled();
    });
  });
});
