import React from "react";
import { render, screen } from "@testing-library/react";
import CheckBeaconDetails from "../../src/pages/register-a-beacon/check-beacon-details";

describe("CheckBeaconDetails", () => {
  it("should have a back button which directs the user to the service start page", () => {
    render(<CheckBeaconDetails />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
