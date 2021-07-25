import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
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
    render(<EmergencyContact form={emptyEmergencyContactForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/beacon-owner-address?useIndex=0"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <EmergencyContact form={emptyEmergencyContactForm} />
    );

    const form = container.querySelectorAll("form")[1];

    expect(form).toHaveAttribute("action", "");
  });
});
