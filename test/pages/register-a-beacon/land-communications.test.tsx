import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { PageURLs } from "../../../src/lib/urls";
import LandCommunications from "../../../src/pages/register-a-beacon/land-communications";

describe("LandOtherCommunications", () => {
  const emptyLandOtherCommunicationsForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
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

  it("should have a back button which directs the user to the Activity page", () => {
    render(
      <LandCommunications
        form={emptyLandOtherCommunicationsForm}
        useIndex={0}
        showCookieBanner={false}
      />
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      expect.stringContaining(PageURLs.activity)
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <LandCommunications
        form={emptyLandOtherCommunicationsForm}
        useIndex={0}
        showCookieBanner={false}
      />
    );

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", "");
  });

  it("should have an autocomplete attribute on the mobile telephone number field", () => {
    const { container } = render(
      <LandCommunications
        form={emptyLandOtherCommunicationsForm}
        useIndex={0}
        showCookieBanner={false}
      />
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
      <LandCommunications
        form={emptyLandOtherCommunicationsForm}
        useIndex={0}
        showCookieBanner={false}
      />
    );

    const satelliteTelephoneNumberInput = container.querySelector(
      "#satelliteTelephoneInput"
    );

    expect(satelliteTelephoneNumberInput).not.toHaveAttribute("autocomplete");
  });
});
