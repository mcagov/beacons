/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/FormManager";
import VesselCommunications from "../../../src/pages/register-a-beacon/vessel-communications";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    query: { useId: "1" },
  })),
}));

describe("VesselCommunications", () => {
  const emptyVesselCommunicationsForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      callSign: {
        value: "",
        errorMessages: [],
      },
      vhfRadio: {
        value: "",
        errorMessages: [],
      },
      fixedVhfRadio: {
        value: "",
        errorMessages: [],
      },
      fixedVhfRadioInput: {
        value: "",
        errorMessages: [],
      },
      portableVhfRadio: {
        value: "",
        errorMessages: [],
      },
      portableVhfRadioInput: {
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

  it("should have an autocomplete attribute on the mobile telephone number field", () => {
    const { container } = render(
      <VesselCommunications
        form={emptyVesselCommunicationsForm}
        useId={"0"}
        showCookieBanner={false}
      />,
    );

    const mobilePhoneInput1 = container.querySelector("#mobileTelephoneInput1");
    const mobilePhoneInput2 = container.querySelector("#mobileTelephoneInput2");

    expect(mobilePhoneInput1).toHaveAttribute("autocomplete", "tel");
    expect(mobilePhoneInput2).toHaveAttribute("autocomplete", "tel");
  });

  it("should not have an autocomplete attribute on the satellite telephone number field", () => {
    // Because this is likely to result in users' mobile and other more commonly used
    // numbers being autocompleted into the satellite number field.  We don't want this.
    const { container } = render(
      <VesselCommunications
        form={emptyVesselCommunicationsForm}
        useId={"0"}
        showCookieBanner={false}
      />,
    );

    const satelliteTelephoneNumberInput = container.querySelector(
      "#satelliteTelephoneInput",
    );

    expect(satelliteTelephoneNumberInput).not.toHaveAttribute("autocomplete");
  });
});
