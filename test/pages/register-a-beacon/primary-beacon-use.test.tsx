import React from "react";
import { render, screen } from "@testing-library/react";
import PrimaryBeaconUse from "../../../src/pages/register-a-beacon/primary-beacon-use";

describe("PrimaryBeaconUse", () => {
  it("should have a back button which directs the user to the beacon information page", () => {
    render(<PrimaryBeaconUse />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/beacon-information"
    );
  });
});
