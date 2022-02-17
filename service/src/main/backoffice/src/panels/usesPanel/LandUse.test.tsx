import { render, screen } from "@testing-library/react";
import { Activities, IUse } from "entities/IUse";
import React from "react";
import { LandUse } from "./LandUse";

describe("Land Use", () => {
  it("should display the more details", async () => {
    const use: IUse = {
      activity: Activities.ClimbingMountaineering,
      moreDetails: "In the highlands of Scotland",
    } as IUse;
    render(<LandUse use={use} />);

    expect(
      await screen.findByText("IN THE HIGHLANDS OF SCOTLAND")
    ).toBeVisible();
  });

  it("should display the summary for a land use of working remotely", async () => {
    const use: IUse = {
      activity: Activities.WorkingRemotely,
      workingRemotelyLocation: "In bristol hiking",
      workingRemotelyPeopleCount: 5,
    } as IUse;

    render(<LandUse use={use} />);

    expect(await screen.findByText("IN BRISTOL HIKING")).toBeVisible();
    expect(await screen.findByText("5")).toBeVisible();
  });

  it("should display the summary for a land use of working on a windfarm", async () => {
    const use: IUse = {
      activity: Activities.Windfarm,
      windfarmLocation: "In Scotland",
      windfarmPeopleCount: "5",
    } as IUse;

    render(<LandUse use={use} />);

    expect(await screen.findByText("IN SCOTLAND")).toBeVisible();
    expect(await screen.findByText("5")).toBeVisible();
  });

  it("should display the summary for a land use of other", async () => {
    const use: IUse = {
      activity: Activities.Other,
      otherActivity: "Jogging",
      otherActivityLocation: "In the mountains",
      otherActivityPeopleCount: "2",
    } as IUse;

    render(<LandUse use={use} />);

    expect(await screen.findByText("JOGGING")).toBeVisible();
    expect(await screen.findByText("IN THE MOUNTAINS")).toBeVisible();
    expect(await screen.findByText("2")).toBeVisible();
  });

  it("should display the communications", async () => {
    const use: IUse = {
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
    render(<LandUse use={use} />);

    expect(await screen.findByText("Communication type 1:")).toBeVisible();
    expect(await screen.findByText("PORTABLE VHF/DSC")).toBeVisible();
    expect(await screen.findByText("2359")).toBeVisible();

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
});
