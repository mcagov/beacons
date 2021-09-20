/**
 * @jest-environment jsdom
 */

import { render, screen, within } from "@testing-library/react";
import React from "react";
import { AdditionalBeaconUseSummary } from "../../../src/components/domain/AdditionalBeaconUseSummary";
import { BeaconUse } from "../../../src/entities/BeaconUse";
import { Environment } from "../../../src/lib/deprecatedRegistration/types";
import { getMockUse } from "../../mocks";

describe("AdditionalBeaconUseSummary", () => {
  it("displays the use's ranking in user friendly terms", () => {
    const use: BeaconUse = getMockUse();

    render(<AdditionalBeaconUseSummary use={use} index={0} />);

    expect(screen.getByText(/main use/i)).toBeVisible();
  });

  it("displays the environment, activity and purpose in the heading", () => {
    const use: BeaconUse = getMockUse();

    render(<AdditionalBeaconUseSummary use={use} index={0} />);

    const heading = within(screen.getByRole("heading"));
    expect(heading.getByText(use.environment, { exact: false })).toBeVisible();
    expect(heading.getByText(use.activity, { exact: false })).toBeVisible();
    expect(heading.getByText(use.purpose, { exact: false })).toBeVisible();
  });

  it("has a change link to allow editing of the use", () => {
    const use: BeaconUse = getMockUse();
    const index = 0;

    render(
      <AdditionalBeaconUseSummary use={use} index={index} changeUri={"#"} />
    );

    const changeLink = screen.getByRole("link", { name: /change/i });
    expect(changeLink).toHaveAttribute("href", "#");
  });

  it("has a delete link to allow deleting the use", () => {
    const use: BeaconUse = getMockUse();
    const useIndex = 0;

    render(
      <AdditionalBeaconUseSummary use={use} index={useIndex} deleteUri={"#"} />
    );

    const deleteLink = screen.getByRole("link", { name: /delete/i });
    expect(deleteLink).toHaveAttribute("href", "#");
  });

  it("displays the vhfRadio boolean as 'VHF radio''", () => {
    const use: BeaconUse = { ...getMockUse(), vhfRadio: "true" };

    render(<AdditionalBeaconUseSummary use={use} index={0} />);

    expect(screen.getByText(/VHF radio/i));
  });

  it("displays the dongle boolean as 'Dongle''", () => {
    const use: BeaconUse = {
      ...getMockUse(),
      environment: Environment.AVIATION,
      dongle: "true",
    };

    render(<AdditionalBeaconUseSummary use={use} index={0} />);

    expect(screen.getByText(/dongle/i));
  });

  it("displays the value of all text fields", () => {
    const use: BeaconUse = getMockUse();
    const textFields = [
      "callSign",
      "fixedVhfRadioInput",
      "portableVhfRadioInput",
      "satelliteTelephoneInput",
      "mobileTelephoneInput1",
      "mobileTelephoneInput2",
      "otherCommunicationInput",
      "maxCapacity",
      "vesselName",
      "portLetterNumber",
      "homeport",
      "areaOfOperation",
      "beaconLocation",
      "imoNumber",
      "ssrNumber",
      "rssNumber",
      "officialNumber",
      "rigPlatformLocation",
      "aircraftManufacturer",
      "principalAirport",
      "secondaryAirport",
      "registrationMark",
      "hexAddress",
      "cnOrMsnNumber",
      "beaconPosition",
      "workingRemotelyLocation",
      "workingRemotelyPeopleCount",
      "windfarmLocation",
      "windfarmPeopleCount",
      "otherActivityText",
      "otherActivityLocation",
      "otherActivityPeopleCount",
      "moreDetails",
    ];

    render(<AdditionalBeaconUseSummary use={use} index={0} />);

    textFields.forEach((fieldName) => {
      expect(screen.getByText(new RegExp(use[fieldName], "i"))).toBeVisible();
    });
  });
});
