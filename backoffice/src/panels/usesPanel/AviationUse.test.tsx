import { render, screen } from "@testing-library/react";
import { IUse } from "entities/IUse";
import React from "react";
import { Placeholders } from "utils/writingStyle";
import { AviationUse } from "./AviationUse";

describe("Aviation Use", () => {
  it("should display the aircraft summary", async () => {
    const use: IUse = {
      maxCapacity: 10,
      aircraftManufacturer: "Boeing",
      principalAirport: "Bristol",
      secondaryAirport: "Newport",
      registrationMark: "G-AAAA",
      hexAddress: "AC82EC",
      cnOrMsnNumber: "M-ZYXW",
      dongle: true,
      beaconPosition: "Stowed inside the nose of the aircraft",
      moreDetails: "In my carry bag",
    } as IUse;
    render(<AviationUse use={use} />);

    expect(await screen.findByText("10")).toBeVisible();
    expect(await screen.findByText("BOEING")).toBeVisible();
    expect(await screen.findByText("BRISTOL")).toBeVisible();
    expect(await screen.findByText("NEWPORT")).toBeVisible();
    expect(await screen.findByText("G-AAAA")).toBeVisible();
    expect(await screen.findByText("AC82EC")).toBeVisible();
    expect(await screen.findByText("M-ZYXW")).toBeVisible();
    expect(await screen.findByText("YES")).toBeVisible();
    expect(
      await screen.findByText("STOWED INSIDE THE NOSE OF THE AIRCRAFT")
    ).toBeVisible();
    expect(await screen.findByText("IN MY CARRY BAG")).toBeVisible();
  });

  it("should display NO if the beacon is not a dongle", async () => {
    const use: IUse = {
      dongle: false,
    } as IUse;
    render(<AviationUse use={use} />);

    expect(await screen.findByText("NO")).toBeVisible();
  });

  it("should display the aircraft communications", async () => {
    const use: IUse = {
      vhfRadio: true,
      satelliteTelephone: true,
      satelliteTelephoneValue: "+8707",
      mobileTelephone: true,
      mobileTelephone1: "07713812667",
      mobileTelephone2: "07713812668",
      otherCommunication: true,
      otherCommunicationValue: "You can contact me via my partner",
    } as IUse;

    render(<AviationUse use={use} />);

    expect(await screen.findByText("Communication type 1:")).toBeVisible();
    expect(await screen.findByText("VHF RADIO")).toBeVisible();

    expect(await screen.findByText("Communication type 2:")).toBeVisible();
    expect(await screen.findByText("SATELLITE TELEPHONE")).toBeVisible();
    expect(await screen.findByText("+8707")).toBeVisible();

    expect(await screen.findByText("Communication type 3:")).toBeVisible();
    expect(await screen.findByText("MOBILE PHONE")).toBeVisible();
    expect(await screen.findByText("07713812667")).toBeVisible();
    expect(await screen.findByText("07713812668")).toBeVisible();

    expect(await screen.findByText("Communication type 4:")).toBeVisible();
    expect(await screen.findByText("OTHER")).toBeVisible();
    expect(
      await screen.findByText("YOU CAN CONTACT ME VIA MY PARTNER")
    ).toBeVisible();
  });

  it("should display the no data placeholder for fields that are not set", async () => {
    const use: IUse = {} as IUse;
    render(<AviationUse use={use} />);
    expect(await (await screen.findAllByText(Placeholders.NoData)).length).toBe(
      9
    );
  });
});
