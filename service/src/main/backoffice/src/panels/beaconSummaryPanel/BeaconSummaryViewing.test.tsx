import { render, screen } from "@testing-library/react";
import { beaconFixture } from "../../fixtures/beacons.fixture";
import { Placeholders } from "../../utils/writingStyle";
import { BeaconSummaryViewing } from "./BeaconSummaryViewing";

describe("BeaconSummaryViewing", () => {
  it("displays fields with blank string as the 'no data' placeholder", async () => {
    const beaconWithUndefinedField = {
      ...beaconFixture,
      protocol: "",
    };

    render(<BeaconSummaryViewing beacon={beaconWithUndefinedField} />);

    expect(await screen.findByText(Placeholders.NoData)).toBeVisible();
  });
});
