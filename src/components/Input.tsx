import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { FormHint, FormLabel } from "./Form";

export interface FormInputProps {
  value: string;
  errorMessages?: string[];
  showErrors?: boolean;
}

interface InputProps {
  id: string;
  label: string;
  name?: string;
  hintText?: string;
  type?: string;
  labelClassName?: string;
  inputClassName?: string;
  htmlAttributes?: InputHTMLAttributes<Element>;
  defaultValue?: string;
  numOfChars?: 2 | 3 | 4 | 5 | 10 | 20;
}

export const Input: FunctionComponent<InputProps> = ({
  id,
  label,
  name = null,
  hintText = null,
  type = "text",
  htmlAttributes = {},
  labelClassName = "",
  inputClassName = "",
  defaultValue = "",
  numOfChars = null,
}: InputProps): JSX.Element => {
  const inputWidthClass: string = numOfChars
    ? `govuk-input--width-${numOfChars}`
    : "";

  name = name ? name : id;

  let hintComponent: ReactNode;
  if (hintText) {
    hintComponent = <FormHint forId={id}>{hintText}</FormHint>;
    htmlAttributes = { ...htmlAttributes, "aria-describedby": `${id}-hint` };
  }

  return (
    <>
      <FormLabel className={labelClassName} htmlFor={id}>
        {label}
      </FormLabel>
      {hintComponent}

      <input
        className={`govuk-input ${inputClassName} ${inputWidthClass}`}
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        {...htmlAttributes}
      />
    </>
  );
};
