import { render, screen } from "@testing-library/react";
import React from "react";
import BeaconInformationPage from "../../../src/pages/register-a-beacon/beacon-information";
import PrimaryBeaconUse from "../../../src/pages/register-a-beacon/primary-beacon-use";

describe("BeaconInformationPage", () => {
  it("should have a back button which directs the user to the check beacon details page", () => {
    render(<BeaconInformationPage />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/check-beacon-details"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const result = render(<PrimaryBeaconUse />);

    const form = result.container.querySelector("form");

    expect(form).toHaveAttribute(
      "action",
      "/register-a-beacon/beacon-information"
    );
  });
});
