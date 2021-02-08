import React, { FunctionComponent, PropsWithChildren, ReactNode } from "react";
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
  children: ReactNode;
}

interface InputProps {
  id: string;
  name: string;
  type?: string;
  spellCheck?: boolean;
}

interface SelectProps {
  name: string;
  defaultValue: string;
  children: ReactNode;
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
}: FormGroupProps): JSX.Element => (
  <div className="govuk-form-group">{children}</div>
);

export const FormFieldset: FunctionComponent<FormFieldsetProps> = ({
  ariaDescribedBy = null,
  children,
}: PropsWithChildren<FormFieldsetProps>): JSX.Element => (
  <fieldset className="govuk-fieldset" aria-describedby={ariaDescribedBy}>
    {children}
  </fieldset>
);

export const FormLegend: FunctionComponent<FormLegendProps> = ({
  children,
}: FormLegendProps): JSX.Element => (
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
  id,
  className = "",
  children,
}: FormHintProps): JSX.Element => (
  <div id={`${id}-hint`} className={`govuk-hint ${className}`}>
    {children}
  </div>
);

export const Input: FunctionComponent<InputProps> = ({
  id,
  name,
  type = "text",
  spellCheck = true,
}: InputProps): JSX.Element => (
  <input
    className="govuk-input"
    id={id}
    name={name}
    type={type}
    spellCheck={spellCheck}
  />
);

export const Select: FunctionComponent<SelectProps> = ({
  name,
  defaultValue,
  children,
}: SelectProps): JSX.Element => (
  <select className="govuk-select" name={name} defaultValue={defaultValue}>
    {children}
  </select>
);

export const SelectOption: FunctionComponent<SelectOptionProps> = ({
  value,
  children,
}: SelectOptionProps): JSX.Element => <option value={value}>{children}</option>;
