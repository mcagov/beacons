import { render } from "@testing-library/react";
import React from "react";
import { IAppContainer } from "../../../src/lib/appContainer";
import { formSubmissionCookieId } from "../../../src/lib/types";
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

jest.mock("../../../src/lib/container", () => ({
  _esModule: true,
  withCookieContainer: jest.fn((callback) => async (context) =>
    callback(context)
  ),
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
    let context;

    beforeEach(() => {
      mockCreateRegistration = jest.fn();
      mockSendGovNotifyEmail = jest.fn();

      mockAppContainer = getAppContainerMock({
        getCreateRegistration: jest.fn(() => ({
          execute: mockCreateRegistration,
        })),
        getSendGovNotifyEmail: jest.fn(() => ({
          execute: mockSendGovNotifyEmail,
        })),
      });

      context = {
        req: { cookies: { [formSubmissionCookieId]: "1" } },
        container: mockAppContainer,
      };
    });

    it("should not have a reference number if creating the registration is unsuccessful", async () => {
      mockCreateRegistration.mockResolvedValue(false);
      const result = await getServerSideProps(context);

      expect(result.props.reference).toBe("");
      expect(mockCreateRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).not.toHaveBeenCalled();
    });

    it("should create the registration, send the email via gov notify and return the reference number", async () => {
      mockCreateRegistration.mockResolvedValue(true);
      mockSendGovNotifyEmail.mockResolvedValue(true);

      const result = await getServerSideProps(context);

      expect(result.props.reference.length).toBe(7);
      expect(mockCreateRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).toHaveBeenCalled();
    });

    it("should create the registration, and return the reference number if the email cannot be sent", async () => {
      mockCreateRegistration.mockResolvedValue(true);
      mockSendGovNotifyEmail.mockResolvedValue(false);

      const result = await getServerSideProps(context);

      expect(result.props.reference.length).toBe(7);
      expect(mockCreateRegistration).toHaveBeenCalled();
      expect(mockSendGovNotifyEmail).toHaveBeenCalled();
    });
  });
});
