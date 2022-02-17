import { render, screen } from "@testing-library/react";
import { IUse } from "entities/IUse";
import React from "react";
import { Placeholders } from "utils/writingStyle";
import { MaritimeUse } from "./MaritimeUse";

describe("Maritime Use", () => {
  it("should display the vessel summary", async () => {
    const use: IUse = {
      maxCapacity: 10,
      vesselName: "Homeland",
      beaconLocation: "In my carry bag",
      portLetterNumber: "XYZ123",
      homeport: "Newport",
      areaOfOperation: "Whitesands Bay",
      imoNumber: "IMO123",
      ssrNumber: "SSR 123456",
      rssNumber: "A12345",
      officialNumber: "Fish and Ships",
      rigPlatformLocation: "Scotland",
      moreDetails: "Red vessel, blue handles",
    } as IUse;

    render(<MaritimeUse use={use} />);

    expect(await screen.findByText("10")).toBeVisible();
    expect(await screen.findByText("HOMELAND")).toBeVisible();
    expect(await screen.findByText("IN MY CARRY BAG")).toBeVisible();
    expect(await screen.findByText("XYZ123")).toBeVisible();
    expect(await screen.findByText("NEWPORT")).toBeVisible();
    expect(await screen.findByText("WHITESANDS BAY")).toBeVisible();
    expect(await screen.findByText("IMO123")).toBeVisible();
    expect(await screen.findByText("SSR 123456")).toBeVisible();
    expect(await screen.findByText("A12345")).toBeVisible();
    expect(await screen.findByText("FISH AND SHIPS")).toBeVisible();
    expect(await screen.findByText("SCOTLAND")).toBeVisible();
    expect(await screen.findByText("RED VESSEL, BLUE HANDLES")).toBeVisible();
  });

  it("should display the vessel communications", async () => {
    const use: IUse = {
      callSign: "Call me",
      vhfRadio: true,
      fixedVhfRadio: true,
      fixedVhfRadioValue: "My MMSI number",
      portableVhfRadio: true,
      portableVhfRadioValue: "2359",
      satelliteTelephone: true,
      satelliteTelephoneValue: "+8707",
      mobileTelephone: true,
      mobileTelephone1: "07713812667",
      mobileTelephone2: "07713812668",
      otherCommunication: true,
      otherCommunicationValue: "You can contact me via my partner",
    } as IUse;
    render(<MaritimeUse use={use} />);

    expect(await screen.findByText("CALL ME")).toBeVisible();

    expect(await screen.findByText("Communication type 1:")).toBeVisible();
    expect(await screen.findByText("VHF RADIO")).toBeVisible();

    expect(await screen.findByText("Communication type 2:")).toBeVisible();
    expect(await screen.findByText("FIXED VHF/DSC")).toBeVisible();
    expect(await screen.findByText("MY MMSI NUMBER")).toBeVisible();

    expect(await screen.findByText("Communication type 3:")).toBeVisible();
    expect(await screen.findByText("PORTABLE VHF/DSC")).toBeVisible();
    expect(await screen.findByText("2359")).toBeVisible();

    expect(await screen.findByText("Communication type 4:")).toBeVisible();
    expect(await screen.findByText("SATELLITE TELEPHONE")).toBeVisible();
    expect(await screen.findByText("+8707")).toBeVisible();

    expect(await screen.findByText("Communication type 5:")).toBeVisible();
    expect(await screen.findByText("MOBILE PHONE")).toBeVisible();
    expect(await screen.findByText("07713812667")).toBeVisible();
    expect(await screen.findByText("07713812668")).toBeVisible();

    expect(await screen.findByText("Communication type 6:")).toBeVisible();
    expect(await screen.findByText("OTHER")).toBeVisible();
    expect(
      await screen.findByText("YOU CAN CONTACT ME VIA MY PARTNER")
    ).toBeVisible();
  });

  it("should display the no data placeholder for fields that are not set", async () => {
    const use: IUse = {} as IUse;
    render(<MaritimeUse use={use} />);
    expect(await (await screen.findAllByText(Placeholders.NoData)).length).toBe(
      13
    );
  });
});
