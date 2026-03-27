import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/styles";
import { render, waitFor } from "@testing-library/react";
import { AuthProvider } from "../components/auth/AuthProvider";
import { legacyBeaconFixture } from "../fixtures/legacybeacons.fixture";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";
import { ILegacyBeaconsGateway } from "../gateways/legacy-beacons/ILegacyBeaconsGateway";
import { MemoryRouter } from "react-router-dom";
import { SingleLegacyBeaconRecordView } from "./SingleLegacyBeaconRecordView";

jest.mock("../utils/logger");

describe("SingleLegacyBeaconRecordView", () => {
  let beaconsGatewayDouble: IBeaconsGateway;
  let legacyBeaconsGatewayDouble: ILegacyBeaconsGateway;

  beforeEach(() => {
    beaconsGatewayDouble = {
      getBeacon: jest.fn(),
      getAllBeacons: jest.fn(),
      updateBeacon: jest.fn(),
      deleteBeacon: jest.fn(),
    };
    legacyBeaconsGatewayDouble = {
      getLegacyBeacon: jest.fn().mockResolvedValue(legacyBeaconFixture),
      updateRecoveryEmail: jest.fn(),
    };
  });

  it("does not call the gateway with undefined when the beacon has no hexId", async () => {
    const beaconWithoutHexId = { ...legacyBeaconFixture, hexId: "" };
    legacyBeaconsGatewayDouble.getLegacyBeacon = jest
      .fn()
      .mockResolvedValue(beaconWithoutHexId);

    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <AuthProvider>
            <SingleLegacyBeaconRecordView
              beaconsGateway={beaconsGatewayDouble}
              legacyBeaconsGateway={legacyBeaconsGatewayDouble}
              beaconId={legacyBeaconFixture.id}
            />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(legacyBeaconsGatewayDouble.getLegacyBeacon).not.toHaveBeenCalledWith(
        undefined,
      );
    });
  });
});
