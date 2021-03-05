import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import MoreVesselDetails from "../../../src/pages/register-a-beacon/more-vessel-details";

describe("MoreVesselDetails page", () => {
  const emptyMoreVesselDetailsForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      moreVesselDetails: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should have a back button which directs the user to the previous form page", () => {
    render(<MoreVesselDetails form={emptyMoreVesselDetailsForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/vessel-communications"
    );
  });
});
