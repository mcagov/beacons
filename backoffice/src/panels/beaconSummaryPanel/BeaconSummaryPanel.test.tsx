import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beaconFixture } from "../../fixtures/beacons.fixture";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { AuthContext, IAuthContext } from "components/auth/AuthProvider";
import { Placeholders } from "../../utils/writingStyle";
import { BeaconSummaryPanel } from "./BeaconSummaryPanel";

jest.mock("../../utils/logger");

describe("BeaconSummaryPanel", () => {
  let beaconsGatewayDouble: IBeaconsGateway;
  let authContext: IAuthContext;

  beforeEach(() => {
    beaconsGatewayDouble = {
      getBeacon: jest.fn().mockResolvedValue(beaconFixture),
      getAllBeacons: jest.fn(),
      updateBeacon: jest.fn(),
      deleteBeacon: jest.fn(),
    };
    authContext = {
      user: {
        type: "loggedInUser",
        attributes: {
          username: "steve.stevington@mcga.gov.uk",
          displayName: "Steve Stevington",
          roles: ["UPDATE_RECORDS"],
        },
        apiAccessToken: "mockAccessTokenString",
      },
      logout: jest.fn(),
    };
  });

  it("calls the injected BeaconsGateway", async () => {
    render(
      <AuthContext.Provider value={authContext}>
        <BeaconSummaryPanel
          beaconsGateway={beaconsGatewayDouble}
          beaconId={beaconFixture.id}
        />
      </AuthContext.Provider>,
    );

    await waitFor(() => {
      expect(beaconsGatewayDouble.getBeacon).toHaveBeenCalled();
    });
  });

  it("displays an error if beacon lookup fails for any reason", async () => {
    beaconsGatewayDouble.getBeacon = jest.fn().mockImplementation(() => {
      throw Error();
    });
    jest.spyOn(console, "error").mockImplementation(() => {}); // Avoid console error failing test
    render(
      <AuthContext.Provider value={authContext}>
        <BeaconSummaryPanel
          beaconsGateway={beaconsGatewayDouble}
          beaconId={"doesn't exist"}
        />
      </AuthContext.Provider>,
    );

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(
      await screen.findByText(Placeholders.UnspecifiedError),
    ).toBeVisible();
  });

  it("fetches beacon data on state change", async () => {
    render(
      <AuthContext.Provider value={authContext}>
        <BeaconSummaryPanel
          beaconsGateway={beaconsGatewayDouble}
          beaconId={beaconFixture.id}
        />
      </AuthContext.Provider>,
    );
    expect(beaconsGatewayDouble.getBeacon).toHaveBeenCalledTimes(1);

    const editButton = await screen.findByText(/edit summary/i);
    await userEvent.click(editButton);
    expect(beaconsGatewayDouble.getBeacon).toHaveBeenCalledTimes(2);

    const cancelButton = await screen.findByRole("button", {
      name: "Cancel",
    });
    await userEvent.click(cancelButton);
    expect(beaconsGatewayDouble.getBeacon).toHaveBeenCalledTimes(3);
  });

  it("expect edit button with UPDATE_RECORDS role", async () => {
    let brtAuthContext: IAuthContext = {
      user: {
        type: "loggedInUser",
        attributes: {
          username: "steve.stevington@mcga.gov.uk",
          displayName: "Steve Stevington (BRT)",
          roles: ["UPDATE_RECORDS"],
        },
        apiAccessToken: "mockAccessTokenString",
      },
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={brtAuthContext}>
        <BeaconSummaryPanel
          beaconsGateway={beaconsGatewayDouble}
          beaconId={beaconFixture.id}
        />
      </AuthContext.Provider>,
    );
    const editButton = await screen.findByText(/edit summary/i);

    expect(editButton).toBeVisible();
  });
});
