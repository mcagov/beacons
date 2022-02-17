import React, {
  FunctionComponent,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

interface SelectProps {
  id: string;
  name: string;
  defaultValue: string;
  children: ReactNode;
  htmlAttributes?: SelectHTMLAttributes<Element>;
}

interface SelectOptionProps {
  value: string;
  children: ReactNode;
}

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
