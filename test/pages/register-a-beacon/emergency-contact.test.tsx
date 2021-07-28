import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/FormManager";
import { PageURLs } from "../../../src/lib/urls";
import EmergencyContact from "../../../src/pages/register-a-beacon/emergency-contact";

describe("EmergencyContact", () => {
  const emptyEmergencyContactForm: FormJSON = {
    hasErrors: false,
    fields: {
      emergencyContact1FullName: {
        value: "",
        errorMessages: [],
      },
      emergencyContact1TelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact1AlternativeTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact2FullName: {
        value: "",
        errorMessages: [],
      },
      emergencyContact2TelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact2AlternativeTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact3FullName: {
        value: "",
        errorMessages: [],
      },
      emergencyContact3TelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact3AlternativeTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
    },
    errorSummary: [],
  };

  it("should have a back button which directs the user to the beacon owner page", () => {
    render(
      <EmergencyContact
        form={emptyEmergencyContactForm}
        showCookieBanner={false}
      />
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      PageURLs.beaconOwnerAddress
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <EmergencyContact
        form={emptyEmergencyContactForm}
        showCookieBanner={false}
      />
    );

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", "");
  });
});
