import { render } from "@testing-library/react";
import React from "react";
import { IAppContainer } from "../../../src/lib/appContainer";
import { PageURLs } from "../../../src/lib/urls";
import ApplicationCompletePage, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/application-complete";
import { getAppContainerMock } from "../../mocks";

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
    let mockAppContainer: IAppContainer;
    let mockCreateRegistration: jest.Mock;
    let mockSendGovNotifyEmail: jest.Mock;
    let mockVerifyFormSubmissionCookieIsSet: jest.Mock;
    let mockRedirectTo: jest.Mock;
    let context;

    beforeEach(() => {
      mockCreateRegistration = jest.fn();
      mockSendGovNotifyEmail = jest.fn();
      mockVerifyFormSubmissionCookieIsSet = jest.fn();
      mockRedirectTo = jest.fn();

      mockAppContainer = getAppContainerMock({
        getCreateRegistration: jest.fn(() => ({
          execute: mockCreateRegistration,
        })),
        getSendGovNotifyEmail: jest.fn(() => ({
          execute: mockSendGovNotifyEmail,
        })),
        getVerifyFormSubmissionCookieIsSet: jest.fn(() => ({
          execute: mockVerifyFormSubmissionCookieIsSet,
        })),
        getRedirectTo: jest.fn(() => ({
          execute: mockRedirectTo,
        })),
      });

      context = {
        req: { cookies: {} },
        container: mockAppContainer,
      };
    });

    it("should redirect the user to the start page if their form submission cookie isn't set", async () => {
      mockVerifyFormSubmissionCookieIsSet.mockReturnValue(false);
      await getServerSideProps(context);

      expect(mockVerifyFormSubmissionCookieIsSet).toHaveBeenCalled();
      expect(mockRedirectTo).toHaveBeenCalledWith(PageURLs.start);
    });

    it("should not have a reference number if creating the registration is unsuccessful", async () => {
      mockVerifyFormSubmissionCookieIsSet.mockReturnValue(true);
      mockCreateRegistration.mockResolvedValue(false);
      const result = await getServerSideProps(context);

      expect(result.props.reference).toBe("");
      expect(mockVerifyFormSubmissionCookieIsSet).toHaveBeenCalled();
      expect(mockRedirectTo).not.toHaveBeenCalled();
      expect(mockCreateRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).not.toHaveBeenCalled();
    });

    it("should create the registration, send the email via gov notify and return the reference number", async () => {
      mockVerifyFormSubmissionCookieIsSet.mockReturnValue(true);
      mockCreateRegistration.mockResolvedValue(true);
      mockSendGovNotifyEmail.mockResolvedValue(true);

      const result = await getServerSideProps(context);

      expect(result.props.reference.length).toBe(7);
      expect(mockCreateRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).toHaveBeenCalled();
    });

    it("should create the registration, and return the reference number if the email cannot be sent", async () => {
      mockVerifyFormSubmissionCookieIsSet.mockReturnValue(true);
      mockCreateRegistration.mockResolvedValue(true);
      mockSendGovNotifyEmail.mockResolvedValue(false);

      const result = await getServerSideProps(context);

      expect(result.props.reference.length).toBe(7);
      expect(mockCreateRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).toHaveBeenCalled();
    });
  });
});
