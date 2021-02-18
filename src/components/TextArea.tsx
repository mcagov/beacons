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
  name,
  id,
  maxCharacters,
  htmlAttributes,
  rows,
  children,
}: TextAreaCharacterCountProps): JSX.Element => {
  const [count] = React.useState(0);

  const withinCharacterLimit = count <= maxCharacters;

  const textAreaClass = () => {
    return withinCharacterLimit
      ? "govuk-textarea govuk-js-character-count"
      : "govuk-textarea govuk-js-character-count govuk-textarea--error";
  };

  const textAreaErrorAria = withinCharacterLimit ? "" : `${id}-error`;

  const characterCountClass = () => {
    return withinCharacterLimit
      ? "govuk-hint govuk-character-count__message"
      : "govuk-error-message govuk-character-count__message";
  };
  const characterCountMessage = () => {
    if (count === 0) {
      return `You can enter up to ${maxCharacters} characters`;
    } else {
      return withinCharacterLimit
        ? `You have ${maxCharacters - count} characters remaining`
        : `You have ${count - maxCharacters} characters too many`;
    }
  };

  return (
    <div
      className="govuk-character-count"
      data-module="govuk-character-count"
      data-maxlength={maxCharacters}
    >
      {children}
      <textarea
        className={textAreaClass()}
        id={id}
        name={name}
        rows={rows}
        aria-describedby={`${id}-hint ${id}-info ${textAreaErrorAria}`}
        {...htmlAttributes}
      />
      <div
        id={`${id}-info`}
        className={characterCountClass()}
        aria-live="polite"
      >
        {characterCountMessage()}
      </div>
    </div>
  );
};
