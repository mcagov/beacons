import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface TextAreaProps {
  name: string;
  id: string;
  htmlAttributes?: InputHTMLAttributes<Element>;
  rows?: number;
}

interface TextAreaCharacterCountProps {
  name: string;
  id: string;
  maxCharacters: number;
  value?: string;
  rows?: number;
  htmlAttributes?: InputHTMLAttributes<Element>;
  children: ReactNode;
}

export const TextArea: FunctionComponent<TextAreaProps> = ({
  id,
  name,
  htmlAttributes = {},
  rows = 3,
}: TextAreaProps): JSX.Element => {
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
  value = "",
  name,
  id,
  maxCharacters,
  htmlAttributes,
  rows,
  children,
}: TextAreaCharacterCountProps): JSX.Element => {
  return (
    <div
      className="govuk-character-count"
      data-module="govuk-character-count"
      data-maxlength={maxCharacters}
    >
      {children}
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
