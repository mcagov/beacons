import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import BeaconInformationPage from "../../../src/pages/register-a-beacon/beacon-information";

describe("BeaconInformationPage", () => {
  const emptyBeaconInformationPageForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      manufacturerSerialNumber: {
        value: "",
        errorMessages: [],
      },
      chkCode: {
        value: "",
        errorMessages: [],
      },
      batteryExpiryDate: { value: "", errorMessages: [] },
      batteryExpiryDateMonth: {
        value: "",
        errorMessages: [],
      },
      batteryExpiryDateYear: {
        value: "",
        errorMessages: [],
      },
      lastServicedDate: { value: "", errorMessages: [] },
      lastServicedDateMonth: {
        value: "",
        errorMessages: [],
      },
      lastServicedDateYear: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should have a back button which directs the user to the check beacon details page", () => {
    render(
      <BeaconInformationPage
        form={emptyBeaconInformationPageForm}
        showCookieBanner={false}
      />
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/check-beacon-details?useIndex=0"
    );
  });
});
