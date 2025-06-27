import { render, screen, waitFor } from "@testing-library/react";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";
import { BrowserRouter } from "react-router-dom";
import { beaconSearchResultFixture } from "../fixtures/beaconSearchResult.fixture";
import { BeaconRecordsListView } from "./BeaconRecordsListView";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.mock("../components/layout/PageContent", () => ({
  PageContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-content">{children}</div>
  ),
}));

describe("<BeaconRecordsListView />", () => {
  let beaconsGatewayDouble: IBeaconsGateway;
  const theme = createTheme();

  const renderRecordsList = () => {
    return render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <BeaconRecordsListView beaconsGateway={beaconsGatewayDouble} />
        </BrowserRouter>
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    beaconsGatewayDouble = {
      getAllBeacons: jest.fn().mockResolvedValue(beaconSearchResultFixture),
      getBeacon: jest.fn(),
      updateBeacon: jest.fn(),
      deleteBeacon: jest.fn(),
    };
  });

  it("renders the BeaconsTable and passes the gateway to it", async () => {
    renderRecordsList();

    const firstBeaconHexId = beaconSearchResultFixture.content[0].hexId;

    expect(await screen.findByText(firstBeaconHexId)).toBeInTheDocument();
  });

  it("calls the gateway to fetch all beacons", async () => {
    renderRecordsList();

    const firstBeaconHexId = beaconSearchResultFixture.content[0].hexId;
    await screen.findByText(firstBeaconHexId);

    expect(beaconsGatewayDouble.getAllBeacons).toHaveBeenCalledTimes(1);
    expect(beaconsGatewayDouble.getAllBeacons).toHaveBeenCalledWith(
      "",
      {},
      0,
      20,
      null,
    );
  });

  it("should request that beacon data is sorted by 'createdDate' descending", async () => {
    renderRecordsList();

    await waitFor(() => {
      expect(beaconsGatewayDouble.getAllBeacons).toHaveBeenCalledTimes(1);
    });

    const callOptions: any = (beaconsGatewayDouble.getAllBeacons as jest.Mock)
      .mock.calls[0];
    console.log("*** callOptions ---> ", callOptions);
    expect(callOptions[4]).toBe("createdDate,desc");
  });
});
