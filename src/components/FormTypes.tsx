import React, { FunctionComponent, ReactNode } from "react";
import { FormFieldset, FormLabel, FormLegendPageHeading } from "./Form";

interface FormFieldsetAndLegendProps {
  children: ReactNode;
  pageHeading: string;
  ariaDescribedBy?: string;
}

interface FormHeadingProps {
  pageHeading: string;
}

interface FormLabelHeadingProps {
  pageHeading: string;
  id: string;
}

export const FormFieldsetAndLegend: FunctionComponent<FormFieldsetAndLegendProps> =
  ({ children, pageHeading, ariaDescribedBy = null }) => {
    return (
      <FormFieldset ariaDescribedBy={ariaDescribedBy}>
        <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
        {children}
      </FormFieldset>
    );
  };

export const FormHeading: FunctionComponent<FormHeadingProps> = ({
  pageHeading,
}) => {
  return (
    <h1 className="govuk-heading-l govuk-!-margin-bottom-3">{pageHeading}</h1>
  );
};

export const FormLabelHeading: FunctionComponent<FormLabelHeadingProps> = ({
  pageHeading,
  id = null,
}) => {
  return (
    <h1 className="govuk-label-wrapper">
      <FormLabel htmlFor={id} className="govuk-label--l">
        {pageHeading}
      </FormLabel>
    </h1>
  );
};
