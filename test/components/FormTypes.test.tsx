import { render } from "@testing-library/react";
import React from "react";
import {
  FormFieldsetAndLegend,
  FormHeading,
  FormLabelHeading,
} from "../../src/components/FormTypes";

describe("FormTypes Component", () => {
  const pageHeading = "Lorem Ipsum";
  it("should render the FormFieldsetAndLegend with correct pageHeading and children", () => {
    render(
      <FormFieldsetAndLegend pageHeading={pageHeading}>
        <p>lorem</p>
      </FormFieldsetAndLegend>
    );
  });

  it("should render the FormFieldsetAndLegend with correct pageHeading, children and ariaDescribedBy", () => {
    render(
      <FormFieldsetAndLegend
        pageHeading={pageHeading}
        ariaDescribedBy="aria-example"
      >
        <p>lorem</p>
      </FormFieldsetAndLegend>
    );
  });

  it("should render the FormHeading", () => {
    render(<FormHeading pageHeading={pageHeading} />);
  });

  it("should render the FormLabelHeading", () => {
    render(<FormLabelHeading id="id-example" pageHeading={pageHeading} />);
  });
});
