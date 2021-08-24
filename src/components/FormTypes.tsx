import React, { FunctionComponent, ReactNode } from "react";
import { FormFieldset, FormLabel, FormLegendPageHeading } from "./Form";

interface FormFieldsetAndLegendProps {
  children: ReactNode;
  pageHeading: string;
  ariaDescribedby?: string;
}

interface FormHeadingProps {
  children: ReactNode;
  pageHeading: string;
}

interface FormLabelHeadingProps {
  children: ReactNode;
  pageHeading: string;
  id: string;
}

export const FormFieldsetAndLegend: FunctionComponent<FormFieldsetAndLegendProps> =
  ({ children, pageHeading, ariaDescribedby = null }) => {
    return (
      <FormFieldset ariaDescribedBy={ariaDescribedby}>
        <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
        {children}
      </FormFieldset>
    );
  };

export const FormHeading: FunctionComponent<FormHeadingProps> = ({
  children,
  pageHeading,
}) => {
  return (
    <>
      <h1 className="govuk-heading-l govuk-!-margin-bottom-3">{pageHeading}</h1>
      {children}
    </>
  );
};

export const FormLabelHeading: FunctionComponent<FormLabelHeadingProps> = ({
  children,
  pageHeading,
  id = null,
}) => {
  return (
    <>
      <h1 className="govuk-label-wrapper">
        <FormLabel htmlFor={id} className="govuk-label--l">
          {pageHeading}
        </FormLabel>
      </h1>
      {children}
    </>
  );
};
