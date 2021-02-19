import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { FormHint, FormLabel } from "./Form";

interface InputProps {
  id: string;
  label: string;
  name?: string;
  hintText?: string;
  type?: string;
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
  }

  return (
    <>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      {hintComponent}

      <input
        className={`govuk-input ${inputWidthClass}`}
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        {...htmlAttributes}
      />
    </>
  );
};
