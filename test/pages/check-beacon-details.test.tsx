import React from "react";
import { render } from "@testing-library/react";
import CheckBeaconDetails from "../../src/pages/register-a-beacon/check-beacon-details";

describe("Check beacon details page", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<CheckBeaconDetails />, {});
    expect(asFragment()).toMatchSnapshot();
  });
});
