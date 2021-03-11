import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import CheckBeaconDetails from "../../../src/pages/register-a-beacon/check-beacon-details";

describe("CheckBeaconDetails", () => {
  it("should have a back button which directs the user to the service start page", () => {
    const form: FormJSON = {
      hasErrors: false,
      fields: {
        model: {
          value: "",
          errorMessages: [],
        },
        manufacturer: {
          value: "",
          errorMessages: [],
        },
        hexId: {
          value: "",
          errorMessages: [],
        },
      },
      errorSummary: [],
    };

    render(<CheckBeaconDetails form={form} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
