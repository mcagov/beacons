import { render, screen, waitFor } from "@testing-library/react";
import { beaconFixture } from "fixtures/beacons.fixture";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { Placeholders } from "../../utils/writingStyle";
import { AccountHolderPanel } from "./AccountHolderPanel";

describe("Account Holder Summary Panel", () => {
  let beaconsGatewayDouble: IBeaconsGateway;

  beforeEach(() => {
    beaconsGatewayDouble = {
      getBeacon: jest.fn().mockResolvedValue(beaconFixture),
      getAllBeacons: jest.fn(),
      updateBeacon: jest.fn(),
      deleteBeacon: jest.fn(),
    };
  });

  it("should display the accountHolders details", async () => {
    render(
      <AccountHolderPanel
        beaconsGateway={beaconsGatewayDouble}
        beaconId={beaconFixture.id}
      />
    );
    const accountHolder = beaconFixture.accountHolder;

    if (accountHolder == null) {
      console.error("Account holder is null.");
      return;
    }

    expect(
      await screen.findByText(new RegExp(accountHolder.fullName, "i"))
    ).toBeVisible();
    expect(
      await screen.findByText(new RegExp(accountHolder.email, "i"))
    ).toBeVisible();
    expect(
      await screen.findByText(new RegExp(accountHolder.telephoneNumber, "i"))
    ).toBeVisible();
    expect(
      await screen.findByText(
        new RegExp(accountHolder.alternativeTelephoneNumber!, "i")
      )
    ).toBeVisible();
    expect(
      await screen.findByText(new RegExp(accountHolder.addressLine1, "i"))
    ).toBeVisible();
    expect(
      await screen.findByText(new RegExp(accountHolder.townOrCity!, "i"))
    ).toBeVisible();
    expect(
      await screen.findByText(new RegExp(accountHolder.county!, "i"))
    ).toBeVisible();
    expect(
      await screen.findByText(new RegExp(accountHolder.postcode!, "i"))
    ).toBeVisible();
    expect(
      await screen.findByText(new RegExp(accountHolder.country!, "i"))
    ).toBeVisible();
  });

  it("calls the injected BeaconsGateway", async () => {
    render(
      <AccountHolderPanel
        beaconsGateway={beaconsGatewayDouble}
        beaconId={beaconFixture.id}
      />
    );

    await waitFor(() => {
      expect(beaconsGatewayDouble.getBeacon).toHaveBeenCalled();
    });
  });

  it("retrieves the accountHolder data by beacon id and displays it", async () => {
    render(
      <AccountHolderPanel
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
      <AccountHolderPanel
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
