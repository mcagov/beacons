import { render, screen, waitFor } from "@testing-library/react";
import { beaconFixture } from "fixtures/beacons.fixture";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { Placeholders } from "../../utils/writingStyle";
import { OwnerPanel } from "./OwnerPanel";

describe("Owner Summary Panel", () => {
  let beaconsGatewayDouble: IBeaconsGateway;

  beforeEach(() => {
    beaconsGatewayDouble = {
      getBeacon: jest.fn().mockResolvedValue(beaconFixture),
      getAllBeacons: jest.fn(),
      updateBeacon: jest.fn(),
      getLegacyBeacon: jest.fn(),
    };
  });

  it("should display the owners details", async () => {
    render(
      <OwnerPanel
        beaconsGateway={beaconsGatewayDouble}
        beaconId={beaconFixture.id}
      />
    );

    expect(await screen.findByText(/Steve Stevington/i)).toBeVisible();
  });

  it("calls the injected BeaconsGateway", async () => {
    render(
      <OwnerPanel
        beaconsGateway={beaconsGatewayDouble}
        beaconId={beaconFixture.id}
      />
    );

    await waitFor(() => {
      expect(beaconsGatewayDouble.getBeacon).toHaveBeenCalled();
    });
  });

  it("retrieves the owner data by beacon id and displays it", async () => {
    render(
      <OwnerPanel
        beaconsGateway={beaconsGatewayDouble}
        beaconId={beaconFixture.id}
      />
    );

    expect(await screen.findByText(/Steve Stevington/i)).toBeVisible();
  });

  it("displays an error if beacon lookup fails for any reason", async () => {
    beaconsGatewayDouble.getBeacon = jest.fn().mockImplementation(() => {
      throw Error();
    });
    jest.spyOn(console, "error").mockImplementation(() => {}); // Avoid console error failing test
    render(
      <OwnerPanel
        beaconsGateway={beaconsGatewayDouble}
        beaconId={"doesn't exist"}
      />
    );

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(
      await screen.findByText(Placeholders.UnspecifiedError)
    ).toBeVisible();
  });
});
