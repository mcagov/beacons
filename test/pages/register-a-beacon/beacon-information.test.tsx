import React from "react";
import { render, screen } from "@testing-library/react";
import BeaconInformationPage from "../../../src/pages/register-a-beacon/beacon-information";

describe("BeaconInformationPage", () => {
  it("should have a back button which directs the user to the check beacon details page", () => {
    render(<BeaconInformationPage />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/check-beacon-details"
    );
  });
});
