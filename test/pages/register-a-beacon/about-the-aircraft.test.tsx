import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import AboutTheAircraft from "../../../src/pages/register-a-beacon/about-the-aircraft";

describe("AboutTheAircraft", () => {
  const aboutTheAircraftForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      maxCapacity: {
        value: "",
        errorMessages: [],
      },
      aircraftManufacturer: {
        value: "",
        errorMessages: [],
      },
      principalAirport: {
        value: "",
        errorMessages: [],
      },
      secondaryAirport: {
        value: "",
        errorMessages: [],
      },
      registrationMark: {
        value: "",
        errorMessages: [],
      },
      hexAddress: {
        value: "",
        errorMessages: [],
      },
      cnOrMsnNumber: {
        value: "",
        errorMessages: [],
      },
      dongle: {
        value: "",
        errorMessages: [],
      },
      beaconPosition: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should have a back button which directs the user to the about the vessel page", () => {
    render(<AboutTheAircraft form={aboutTheAircraftForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/activity?useIndex=0"
    );
  });
});
