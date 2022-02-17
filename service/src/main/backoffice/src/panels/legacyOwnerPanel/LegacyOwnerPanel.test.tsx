import { render, screen } from "@testing-library/react";
import { legacyBeaconFixture } from "fixtures/legacybeacons.fixture";
import { LegacyOwnerPanel } from "./LegacyOwnerPanel";

describe("Owner Summary Panel", () => {
  beforeEach(() => {});

  it("should display the owners details", async () => {
    render(
      <LegacyOwnerPanel
        legacyOwner={legacyBeaconFixture.owner}
        secondaryLegacyOwners={legacyBeaconFixture.secondaryOwners}
      />
    );

    expect(await screen.findByText(/Dr Beacon/i)).toBeVisible();
  });

  it("retrieves the owner data by beacon id and displays it", async () => {
    render(
      <LegacyOwnerPanel
        legacyOwner={legacyBeaconFixture.owner}
        secondaryLegacyOwners={legacyBeaconFixture.secondaryOwners}
      />
    );

    expect(await screen.findByText(/Mr Beacon/i)).toBeVisible();
  });
});
