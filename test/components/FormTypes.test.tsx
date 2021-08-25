import { render } from "@testing-library/react";
import React from "react";
import {
  BeaconsFormFieldsetAndLegend,
  BeaconsFormHeading,
  BeaconsFormLabelHeading,
} from "../../src/components/BeaconsForm";

describe("FormTypes Component", () => {
  const pageHeading = "Lorem Ipsum";
  it("should render the BeaconsFormFieldsetAndLegend with correct pageHeading and children", () => {
    render(
      <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
        <p>lorem</p>
      </BeaconsFormFieldsetAndLegend>
    );
  });

  it("should render the BeaconsFormFieldsetAndLegend with correct pageHeading, children and ariaDescribedBy", () => {
    render(
      <BeaconsFormFieldsetAndLegend
        pageHeading={pageHeading}
        ariaDescribedBy="aria-example"
      >
        <p>lorem</p>
      </BeaconsFormFieldsetAndLegend>
    );
  });

  it("should render the BeaconsFormHeading", () => {
    render(<BeaconsFormHeading pageHeading={pageHeading} />);
  });

  it("should render the FormLabelHeading", () => {
    render(
      <BeaconsFormLabelHeading id="id-example" pageHeading={pageHeading} />
    );
  });
});
