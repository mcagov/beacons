import React, { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { HttpMethod } from "../lib/types";
import { FieldErrorList } from "./ErrorSummary";

interface FormProps {
  action: string;
  method?: HttpMethod;
  children: ReactNode;
}

interface FormFieldsetProps {
  ariaDescribedBy?: string;
  children: ReactNode;
}

interface FormGroupProps {
  children: ReactNode;
  className?: string;
  errorMessages?: string[];
}

interface FormLabelProps {
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

interface FormHintProps {
  forId: string;
  className?: string;
  children: ReactNode;
}

interface FormLegendProps {
  className?: string;
  children: ReactNode;
}

interface FormLegendPageHeadingProps {
  children: ReactNode;
}

export const Form: FunctionComponent<FormProps> = ({
  action,
  method = HttpMethod.POST,
  children,
}: FormProps): JSX.Element => (
  <form action={action} method={method} noValidate={true}>
    {children}
  </form>
);

export const FormGroup: FunctionComponent<FormGroupProps> = ({
  children,
  className = "",
  errorMessages = [],
}: FormGroupProps): JSX.Element => {
  const showErrors = errorMessages.length > 0;
  const errorClassName: string = showErrors ? "govuk-form-group--error" : "";

  let errorsComponent: ReactNode;
  if (showErrors) {
    errorsComponent = <FieldErrorList errorMessages={errorMessages} />;
  }

  return (
    <div className={`govuk-form-group ${className} ${errorClassName}`}>
      {errorsComponent}
      {children}
    </div>
  );
};

export const FormFieldset: FunctionComponent<FormFieldsetProps> = ({
  ariaDescribedBy = null,
  children,
}: PropsWithChildren<FormFieldsetProps>): JSX.Element => (
  <fieldset className="govuk-fieldset" aria-describedby={ariaDescribedBy}>
    {children}
  </fieldset>
);

export const FormLegend: FunctionComponent<FormLegendProps> = ({
  className = "",
  children,
}: FormLegendProps): JSX.Element => (
  <legend className={`govuk-fieldset__legend ${className}`}>{children}</legend>
);

export const FormLegendPageHeading: FunctionComponent<FormLegendPageHeadingProps> = ({
  children,
}: FormLegendPageHeadingProps) => (
  <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
    <h1 className="govuk-fieldset__heading">{children}</h1>
  </legend>
);

export const FormLabel: FunctionComponent<FormLabelProps> = ({
  htmlFor,
  className = "",
  children,
}: FormLabelProps): JSX.Element => (
  <label className={`govuk-label ${className}`} htmlFor={htmlFor}>
    {children}
  </label>
);

export const FormHint: FunctionComponent<FormHintProps> = ({
  forId,
  className = "",
  children,
}: FormHintProps): JSX.Element => (
  <div id={`${forId}-hint`} className={`govuk-hint ${className}`}>
    {children}
  </div>
);
