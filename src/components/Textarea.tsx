import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { FormGroup, FormHint, FormLabel } from "./Form";

interface TextareaProps {
  id: string;
  name?: string;
  defaultValue?: string;
  htmlAttributes?: InputHTMLAttributes<Element>;
  rows?: number;
}

interface TextareaCharacterCountProps {
  id: string;
  maxCharacters: number;
  label?: string;
  defaultValue?: string;
  hintText?: string;
  name?: string;
  rows?: number;
  htmlAttributes?: InputHTMLAttributes<Element>;
}

export const Textarea: FunctionComponent<TextareaProps> = ({
  id,
  name = null,
  defaultValue = "",
  htmlAttributes = {},
  rows = 3,
}: TextareaProps): JSX.Element => {
  name = name ? name : id;

  return (
    <textarea
      className="govuk-textarea"
      id={id}
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      aria-describedby={`${id}-hint`}
      {...htmlAttributes}
    />
  );
};

export const TextareaCharacterCount: FunctionComponent<TextareaCharacterCountProps> = ({
  id,
  maxCharacters,
  label = null,
  defaultValue = "",
  hintText = null,
  name = null,
  rows = 3,
  htmlAttributes = {},
}: TextareaCharacterCountProps): JSX.Element => {
  name = name ? name : id;

  let labelComponent: ReactNode;
  if (label) {
    labelComponent = <FormLabel htmlFor={id}>{label}</FormLabel>;
  }

  let hintComponent: ReactNode;
  if (hintText) {
    hintComponent = <FormHint forId={id}>{hintText}</FormHint>;
  }

  return (
    <div
      className="govuk-character-count"
      data-module="govuk-character-count"
      data-maxlength={maxCharacters}
    >
      <FormGroup>
        {labelComponent}
        {hintComponent}
      </FormGroup>
      <textarea
        className="govuk-textarea govuk-js-character-count"
        id={id}
        name={name}
        rows={rows}
        aria-describedby={`${id}-hint ${id}-info`}
        {...htmlAttributes}
        defaultValue={defaultValue}
      />
      <div
        id={`${id}-info`}
        className="govuk-hint govuk-character-count__message"
        aria-live="polite"
      >
        You can enter up to {maxCharacters} characters
      </div>
    </div>
  );
};
