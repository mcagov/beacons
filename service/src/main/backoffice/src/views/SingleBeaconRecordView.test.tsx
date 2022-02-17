import { render, screen, within } from "@testing-library/react";
import React from "react";
import { beaconFixture } from "../fixtures/beacons.fixture";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";
import { IUsesGateway } from "../gateways/uses/IUsesGateway";
import { SingleBeaconRecordView } from "./SingleBeaconRecordView";

describe("Beacon record page", () => {
  let beaconsGatewayDouble: IBeaconsGateway;
  let usesGatewayDouble: IUsesGateway;

  beforeEach(() => {
    beaconsGatewayDouble = {
      getBeacon: jest.fn().mockResolvedValue(beaconFixture),
      getAllBeacons: jest.fn(),
      updateBeacon: jest.fn(),
    };

    usesGatewayDouble = {
      getUses: jest.fn(),
    };
  });

  it("Displays beacon's hex ID in the header", async () => {
    render(
      <SingleBeaconRecordView
        beaconsGateway={beaconsGatewayDouble}
        usesGateway={usesGatewayDouble}
        beaconId={beaconFixture.id}
      />
    );
    const hexId = beaconFixture.hexId;
    const heading = screen.getByRole("heading");

    expect(
      await within(heading).findByText(`Hex ID/UIN: ${hexId}`, { exact: false })
    ).toBeVisible();
  });

  it("Displays the number of uses a beacon has", async () => {
    render(
      <SingleBeaconRecordView
        beaconsGateway={beaconsGatewayDouble}
        usesGateway={usesGatewayDouble}
        beaconId={beaconFixture.id}
      />
    );
    const numberOfUses = beaconFixture.uses.length;

    expect(
      await screen.findByText(`${numberOfUses} Registered Uses`)
    ).toBeDefined();
  });
});
