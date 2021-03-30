import { render } from "@testing-library/react";
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

  it("renders the page", () => {
    render(<AboutTheAircraft form={aboutTheAircraftForm} />);
  });
});
