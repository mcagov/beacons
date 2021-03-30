import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import MoreDetails from "../../../src/pages/register-a-beacon/more-details";

describe("MoreDetails page", () => {
  const emptyMoreDetailsForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      moreDetails: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should have a back button which directs the user to the previous form page", () => {
    render(<MoreDetails form={emptyMoreDetailsForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/vessel-communications"
    );
  });
});
