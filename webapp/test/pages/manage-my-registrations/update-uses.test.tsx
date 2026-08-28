/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { DraftRegistration } from "../../../src/entities/DraftRegistration";
import AdditionalBeaconUse from "../../../src/pages/manage-my-registrations/[registrationId]/update/uses/index";

describe("Update uses summary page", () => {
  const draftRegistrationWhereEveryUseIsMain: DraftRegistration = {
    id: "registration-id",
    uses: [
      {
        environment: "MARITIME",
        purpose: "PLEASURE",
        activity: "SAILING",
        moreDetails: "More details of this vessel",
        mainUse: true,
      },
      {
        environment: "AVIATION",
        purpose: "PLEASURE",
        activity: "JET_AIRCRAFT",
        moreDetails: "More details of this aircraft",
        mainUse: true,
      },
      {
        environment: "LAND",
        activity: "CYCLING",
        moreDetails: "More details of this activity",
        mainUse: true,
      },
    ],
  };

  const renderPage = (draftRegistration: DraftRegistration) =>
    render(
      <AdditionalBeaconUse
        draftRegistration={draftRegistration}
        uses={draftRegistration.uses}
      />,
    );

  it("marks only one use as the main use when every use claims to be main", () => {
    renderPage(draftRegistrationWhereEveryUseIsMain);

    expect(screen.getAllByText("Yes")).toHaveLength(1);
    expect(screen.getAllByText("No")).toHaveLength(2);
  });

  it("offers a way to change the main use on the uses that are not main", () => {
    renderPage(draftRegistrationWhereEveryUseIsMain);

    expect(screen.getAllByText("Make this the main use")).toHaveLength(2);
  });

  it("marks the first use as main when no use claims to be main", () => {
    renderPage({
      ...draftRegistrationWhereEveryUseIsMain,
      uses: draftRegistrationWhereEveryUseIsMain.uses.map((use) => ({
        ...use,
        mainUse: false,
      })),
    });

    expect(screen.getAllByText("Yes")).toHaveLength(1);
    expect(screen.getAllByText("Make this the main use")).toHaveLength(2);
  });
});
