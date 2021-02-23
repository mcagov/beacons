import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { formSubmissionCookieId } from "../../../src/lib/types";
import PrimaryBeaconUse, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/primary-beacon-use";

// Mock module dependencies in getServerSideProps
jest.mock("../../../src/lib/middleware", () => ({
  __esModule: true,
  updateFormCache: jest.fn().mockReturnValue({}),
  withCookieRedirect: jest.fn().mockImplementation((callback) => {
    return async (context) => {
      return callback(context);
    };
  }),
}));
jest.mock("../../../src/lib/formValidator", () => ({
  __esModule: true,
  FormValidator: {
    hasErrors: jest.fn().mockReturnValue(false),
  },
}));

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
    const mockUserSubmittedFormContext = {
      req: {
        method: "POST",
      },
    };

    const response = await getServerSideProps(
      mockUserSubmittedFormContext as GetServerSidePropsContext
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
