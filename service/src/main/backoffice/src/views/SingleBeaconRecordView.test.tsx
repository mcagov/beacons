import { render, screen, within } from "@testing-library/react";
import React from "react";
import { beaconFixture } from "../fixtures/beacons.fixture";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";
import { IUsesGateway } from "../gateways/uses/IUsesGateway";
import { SingleBeaconRecordView } from "./SingleBeaconRecordView";
import { INotesGateway } from "../gateways/notes/INotesGateway";

describe("Beacon record page", () => {
  let beaconsGatewayDouble: IBeaconsGateway;
  let usesGatewayDouble: IUsesGateway;
  let notesGatewayDouble: INotesGateway;

  beforeEach(() => {
    beaconsGatewayDouble = {
      getBeacon: jest.fn().mockResolvedValue(beaconFixture),
      getAllBeacons: jest.fn(),
      updateBeacon: jest.fn(),
      getLegacyBeacon: jest.fn(),
    };

    usesGatewayDouble = {
      getUses: jest.fn(),
    };

    notesGatewayDouble = {
      getNotes: jest.fn(),
      createNote: jest.fn(),
    };
  });

  it("Displays beacon's hex ID in the header", async () => {
    render(
      <SingleBeaconRecordView
        beaconsGateway={beaconsGatewayDouble}
        usesGateway={usesGatewayDouble}
        beaconId={beaconFixture.id}
        notesGateway={notesGatewayDouble}
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
        notesGateway={notesGatewayDouble}
      />
    );
    const numberOfUses = beaconFixture.uses.length;

    expect(
      await screen.findByText(`${numberOfUses} Registered Uses`)
    ).toBeDefined();
  });
});
