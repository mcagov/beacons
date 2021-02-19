import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { FormGroup, FormHint, FormLabel } from "./Form";

interface TextAreaProps {
  id: string;
  name?: string;
  htmlAttributes?: InputHTMLAttributes<Element>;
  rows?: number;
}

interface TextAreaCharacterCountProps {
  id: string;
  maxCharacters: number;
  label: string;
  hintText?: string;
  name?: string;
  rows?: number;
  htmlAttributes?: InputHTMLAttributes<Element>;
}

export const TextArea: FunctionComponent<TextAreaProps> = ({
  id,
  name = null,
  htmlAttributes = {},
  rows = 3,
}: TextAreaProps): JSX.Element => {
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

export const TextAreaCharacterCount: FunctionComponent<TextAreaCharacterCountProps> = ({
  id,
  maxCharacters,
  rows,
  label,
  htmlAttributes = {},
  name = null,
  hintText = null,
}: TextAreaCharacterCountProps): JSX.Element => {
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
