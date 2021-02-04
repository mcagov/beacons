import React, { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { HttpMethod } from "../lib/types";

export enum FormLegendSize {
  LARGE,
  MEDIUM,
}

interface FormProps {
  url: string;
  method?: HttpMethod;
  children: ReactNode;
}

interface FormFieldsetProps {
  ariaDescribedBy?: string;
  children: ReactNode;
}

interface FormGroupProps {
  children: ReactNode;
}

interface FormLabelProps {
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

interface FormHintProps {
  id: string;
  className?: string;
  children: ReactNode;
}

interface FormLegendProps {
  legendSize?: FormLegendSize;
  children: ReactNode;
}

export const Form: FunctionComponent<FormProps> = ({
  url,
  method = HttpMethod.POST,
  children,
}: FormProps): JSX.Element => (
  <form action={url} method={method}>
    {children}
  </form>
);

export const FormFieldset: FunctionComponent = ({
  ariaDescribedBy = null,
  children,
}: PropsWithChildren<Record<string, string>>) => (
  <fieldset className="govuk-fieldset" aria-describedby={ariaDescribedBy}>
    {children}
  </fieldset>
);

export const FormGroup: FunctionComponent<FormGroupProps> = ({
  children,
}: FormGroupProps): JSX.Element => (
  <div className="govuk-form-group">{children}</div>
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

export const FormLegend: FunctionComponent<FormLegendProps> = ({
  children,
}: FormLegendProps): JSX.Element => (
  <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
    <h1 className="govuk-fieldset__heading">{children}</h1>
  </legend>
);

export const FormHint: FunctionComponent<FormHintProps> = ({
  id,
  className = "",
  children,
}: FormHintProps) => (
  <div id={`${id}-hint`} className={`govuk-hint ${className}`}>
    {children}
  </div>
);
