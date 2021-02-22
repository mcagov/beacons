import { render, screen } from "@testing-library/react";
import React from "react";
import { formSubmissionCookieId } from "../../../src/lib/types";
import PrimaryBeaconUse, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/primary-beacon-use";

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

  it("should redirect to about-the-vessel page on successful form submission", () => {});

  describe("getServerSideProps()", () => {
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
