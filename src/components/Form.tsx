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
  name: string;
  label?: string;
  type?: string;
  spellCheck?: boolean;
}

interface SelectProps {
  name: string;
  children: ReactNode;
  label?: string;
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
  label,
  name,
  type = "text",
  spellCheck = true,
}: InputProps): JSX.Element => (
  <FormGroup>
    {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
    <input
      className="govuk-input"
      name={name}
      type={type}
      spellCheck={spellCheck}
    />
  </FormGroup>
);

export const Select: FunctionComponent<SelectProps> = ({
  label,
  name,
  children,
}: SelectProps): JSX.Element => (
  <FormGroup>
    {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
    <select className="govuk-select" name={name}>
      {children}
    </select>
  </FormGroup>
);

export const SelectOption: FunctionComponent<SelectOptionProps> = ({
  value,
  children,
}: SelectOptionProps): JSX.Element => <option value={value}>{children}</option>;
