import { render } from "@testing-library/react";
import React from "react";
import { IAppContainer } from "../../../src/lib/appContainer";
import { formSubmissionCookieId } from "../../../src/lib/types";
import ApplicationCompletePage, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/application-complete";
import { redirectUserTo } from "../../../src/useCases/redirectUserTo";
import { retrieveUserFormSubmissionId } from "../../../src/useCases/retrieveUserFormSubmissionId";
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
    const mockSubmitRegistration = jest.fn().mockResolvedValue({
      beaconRegistered: true,
      confirmationEmailSent: true,
      registrationNumber: "1AXGFB8",
    });

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

    it("should not throw if there is an error submitting the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        container: mockContainer,
      };
      mockSubmitRegistration.mockImplementation(() => {
        throw new Error();
      });

      const act = async () => await getServerSideProps(context);

      expect(act).not.toThrow();
    });

    it("should feedback to the user if there is an error submitting the user's registration", async () => {
      const userRegistrationId = "user-form-submission-cookie-id";
      const context = {
        req: {
          cookies: { [formSubmissionCookieId]: userRegistrationId },
        },
        container: mockContainer,
      };
      mockSubmitRegistration.mockImplementation(() => {
        throw new Error();
      });

      const result = await getServerSideProps(context);

      expect(result.props.pageSubHeading).toMatch(/error/i);
    });
  });
});
