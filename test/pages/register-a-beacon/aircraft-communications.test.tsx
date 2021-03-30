import { render } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import AircraftCommunications from "../../../src/pages/register-a-beacon/aircraft-communications";

describe("AircraftCommunications", () => {
  const emptyAircraftCommunicationsForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      vhfRadio: {
        value: "",
        errorMessages: [],
      },
      satelliteTelephone: {
        value: "",
        errorMessages: [],
      },
      satelliteTelephoneInput: {
        value: "",
        errorMessages: [],
      },
      mobileTelephone: {
        value: "",
        errorMessages: [],
      },
      mobileTelephoneInput1: {
        value: "",
        errorMessages: [],
      },
      mobileTelephoneInput2: {
        value: "",
        errorMessages: [],
      },
      otherCommunication: {
        value: "",
        errorMessages: [],
      },
      otherCommunicationInput: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should render the aircraft comms page", () => {
    render(<AircraftCommunications form={emptyAircraftCommunicationsForm} />);
  });
});
