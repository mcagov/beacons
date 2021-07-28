import { render, screen } from "@testing-library/react";
import React from "react";
import { Environment } from "../../../src/lib/deprecatedRegistration/types";
import { FormJSON } from "../../../src/lib/form/FormManager";
import MoreDetails from "../../../src/pages/register-a-beacon/more-details";

describe("MoreDetails page", () => {
  const moreDetailsFormTestData: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      moreDetails: {
        value: "test value",
        errorMessages: [],
      },
    },
  };

  it("should render the page", () => {
    render(
      <MoreDetails
        form={moreDetailsFormTestData}
        environment={Environment.MARITIME}
        showCookieBanner={true}
        useIndex={0}
      />
    );

    expect(screen.getByRole("textbox")).toHaveTextContent("test value");
  });
});
