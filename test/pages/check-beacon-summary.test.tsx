import React from "react";
import { render } from "@testing-library/react";
import CheckBeaconSummaryPage from "../../src/pages/register-a-beacon/check-beacon-summary";

describe("Check Beacon Summary Page", () => {
  it("renders correctly", () => {
    const testBeacon = {
      beaconManufacturer: "Raleigh",
      beaconModel: "Chopper",
      beaconHexId: "00FF00",
    };
    const { asFragment } = render(
      <CheckBeaconSummaryPage {...testBeacon} />,
      {}
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
