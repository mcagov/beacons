import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { FormGroup, FormHint, FormLabel } from "./Form";

interface TextareaProps {
  id: string;
  name?: string;
  htmlAttributes?: InputHTMLAttributes<Element>;
  rows?: number;
}

interface TextareaCharacterCountProps {
  id: string;
  maxCharacters: number;
  label: string;
  value?: string;
  hintText?: string;
  name?: string;
  rows?: number;
  htmlAttributes?: InputHTMLAttributes<Element>;
}

export const Textarea: FunctionComponent<TextareaProps> = ({
  id,
  name = null,
  htmlAttributes = {},
  rows = 3,
}: TextareaProps): JSX.Element => {
  name = name ? name : id;

  return (
    <textarea
      className="govuk-textarea"
      id={id}
      name={name}
      rows={rows}
      aria-describedby={`${id}-hint`}
      {...htmlAttributes}
    />
  );
};

export const TextareaCharacterCount: FunctionComponent<TextareaCharacterCountProps> = ({
  id,
  maxCharacters,
  label,
  value = "",
  hintText = null,
  name = null,
  rows = 3,
  htmlAttributes = {},
}: TextareaCharacterCountProps): JSX.Element => {
  name = name ? name : id;

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
        <FormLabel htmlFor={id}>{label}</FormLabel>
        {hintComponent}
      </FormGroup>
      <textarea
        className="govuk-textarea govuk-js-character-count"
        id={id}
        name={name}
        rows={rows}
        aria-describedby={`${id}-hint ${id}-info`}
        {...htmlAttributes}
        defaultValue={value}
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
