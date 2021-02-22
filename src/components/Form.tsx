import React, {
  FunctionComponent,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { HttpMethod } from "../lib/types";

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
  showErrors?: boolean;
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

interface InputProps {
  name: string;
  id: string;
  type?: string;
  htmlAttributes?: InputHTMLAttributes<Element>;
  defaultValue?: string;
  numOfChars?: 2 | 3 | 4 | 5 | 10 | 20;
}

interface SelectProps {
  name: string;
  defaultValue: string;
  children: ReactNode;
  id: string;
  htmlAttributes?: SelectHTMLAttributes<Element>;
}

interface SelectOptionProps {
  value: string;
  children: ReactNode;
}

export const Form: FunctionComponent<FormProps> = ({
  action,
  method = HttpMethod.POST,
  children,
}: FormProps): JSX.Element => (
  <form action={action} method={method}>
    {children}
  </form>
);

export const FormGroup: FunctionComponent<FormGroupProps> = ({
  children,
  className = "",
  showErrors = false,
}: FormGroupProps): JSX.Element => {
  const errorClassName: string = showErrors ? "govuk-form-group--error" : "";

  return (
    <div className={`govuk-form-group ${className} ${errorClassName}`}>
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

export const Input: FunctionComponent<InputProps> = ({
  id,
  name,
  type = "text",
  htmlAttributes = {},
  defaultValue = "",
  numOfChars = null,
}: InputProps): JSX.Element => {
  const inputWidthClass: string = numOfChars
    ? `govuk-input--width-${numOfChars}`
    : "";

  return (
    <input
      className={`govuk-input ${inputWidthClass}`}
      id={id}
      name={name}
      type={type}
      defaultValue={defaultValue}
      {...htmlAttributes}
    />
  );
};

export const Select: FunctionComponent<SelectProps> = ({
  id,
  name,
  defaultValue,
  children,
  htmlAttributes = {},
}: SelectProps): JSX.Element => (
  <select
    className="govuk-select"
    id={id}
    name={name}
    defaultValue={defaultValue}
    {...htmlAttributes}
  >
    {children}
  </select>
);

export const SelectOption: FunctionComponent<SelectOptionProps> = ({
  value,
  children,
}: SelectOptionProps): JSX.Element => <option value={value}>{children}</option>;
