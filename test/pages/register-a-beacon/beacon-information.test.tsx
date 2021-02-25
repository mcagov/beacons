import { render, screen } from "@testing-library/react";
import React from "react";
import BeaconInformationPage from "../../../src/pages/register-a-beacon/beacon-information";

describe("BeaconInformationPage", () => {
  it("should have a back button which directs the user to the check beacon details page", () => {
    render(<BeaconInformationPage />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/check-beacon-details"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(<BeaconInformationPage />);
    const ownPath = "/register-a-beacon/beacon-information";

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });
});
