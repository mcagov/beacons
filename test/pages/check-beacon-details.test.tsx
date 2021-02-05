import React from "react";
import { render } from "@testing-library/react";
import CheckBeaconDetailsPage from "../../src/pages/register-a-beacon/check-beacon-details-page";

describe("Check beacon details page", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<CheckBeaconDetailsPage />, {});
    expect(asFragment()).toMatchSnapshot();
  });
});
