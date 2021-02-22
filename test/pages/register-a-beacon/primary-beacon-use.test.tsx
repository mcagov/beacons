import { render, screen } from "@testing-library/react";
import React from "react";
import { FormValidator } from "../../../src/lib/formValidator";
import {
  updateFormCache,
  withCookieRedirect,
} from "../../../src/lib/middleware";
import { formSubmissionCookieId } from "../../../src/lib/types";
import PrimaryBeaconUse, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/primary-beacon-use";

jest.mock("../../../src/lib/middleware", () => ({
  // updateFormCache: jest.fn(),
  withCookieRedirect: jest
    .fn()
    .mockImplementation((callback) => async () => callback({})),
}));

const mockUpdateFormCache = updateFormCache as jest.Mock;
const mockWithCookieRedirect = withCookieRedirect as jest.Mock;

describe("PrimaryBeaconUse", () => {
  it("should have a back button which directs the user to the beacon information page", () => {
    render(<PrimaryBeaconUse />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/beacon-information"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const result = render(<PrimaryBeaconUse />);
    const ownPath = "/register-a-beacon/primary-beacon-use";

    const form = result.container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to about-the-vessel page on valid form submission", async () => {
    jest.mock("../../../src/lib/formValidator");

    FormValidator.hasErrors = jest.fn().mockReturnValue(false);

    // TODO: Don't use require() syntax
    const MockReq = require("mock-req");
    const req = new MockReq({
      method: "POST",
    });

    const mockUserSubmittedFormContext = () => {
      return {
        req: req,
        cookies: {
          [formSubmissionCookieId]: "1",
        },
      };
    };

    // mockWithCookieRedirect.mockReturnValue("a value");

    // mockWithCookieRedirect.mockImplementation((callback) => {
    //   return "a value";
    //   // async () => callback(mockUserSubmittedFormContext());
    // });

    // mockUpdateFormCache.mockReturnValue({});

    console.log(getServerSideProps);

    const response = await getServerSideProps(
      mockUserSubmittedFormContext() as any
    );

    expect(response).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: "/register-a-beacon/about-the-vessel",
      },
    });
  });

  xdescribe("getServerSideProps()", () => {
    let context;
    beforeEach(() => {
      context = {
        req: {
          cookies: {
            [formSubmissionCookieId]: "1",
          },
        },
      };
    });

    it("should return an empty props object", async () => {
      const expectedProps = await getServerSideProps(context);
      expect(expectedProps).toStrictEqual({ props: {} });
    });
  });
});
