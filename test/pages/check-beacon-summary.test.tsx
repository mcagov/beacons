import React from "react";
import { render } from "@testing-library/react";
import CheckBeaconSummaryPage from "../../src/pages/check-beacon-summary";

describe("Check Beacon Summary Page", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<CheckBeaconSummaryPage />, {});
    expect(asFragment()).toMatchSnapshot();
  });
});
