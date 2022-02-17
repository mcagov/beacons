import { render, screen, waitFor } from "@testing-library/react";
import { IBeaconsGateway } from "gateways/beacons/IBeaconsGateway";
import { BrowserRouter } from "react-router-dom";
import { beaconSearchResultFixture } from "../fixtures/beaconSearchResult.fixture";
import { BeaconsTable } from "./BeaconsTable";

describe("<BeaconsTable>", () => {
  let beaconsGatewayDouble: IBeaconsGateway;

  beforeEach(() => {
    beaconsGatewayDouble = {
      getAllBeacons: jest.fn().mockResolvedValue(beaconSearchResultFixture),
      getBeacon: jest.fn(),
      getLegacyBeacon: jest.fn(),
      updateBeacon: jest.fn(),
    };
  });

  const numberOfMockedBeacons = beaconSearchResultFixture.page.totalElements;

  it("queries the injected gateway for beacon data", async () => {
    render(
      <BrowserRouter>
        <BeaconsTable beaconsGateway={beaconsGatewayDouble} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(beaconsGatewayDouble.getAllBeacons).toHaveBeenCalled();
    });
  });

  it("displays the returned beacon data in the table", async () => {
    render(
      <BrowserRouter>
        <BeaconsTable beaconsGateway={beaconsGatewayDouble} />
      </BrowserRouter>
    );

    expect(await screen.findByText("Hex me difficultly")).toBeVisible();
  });

  it(`displays ${numberOfMockedBeacons} rows when ${numberOfMockedBeacons} beacons are returned from the gateway`, async () => {
    render(
      <BrowserRouter>
        <BeaconsTable beaconsGateway={beaconsGatewayDouble} />
      </BrowserRouter>
    );

    expect(await screen.findAllByTestId("beacons-table-row")).toHaveLength(
      numberOfMockedBeacons
    );
  });
});
