import React, { FunctionComponent, ReactNode } from "react";
import { FormHint, FormLabel } from "./Form";

interface RadioListProps {
  className?: string;
  children: ReactNode;
}

interface RadioListItemProps {
  id: string;
  name: string;
  value: string;
  text: string;
}

interface RadioListItemHintProps {
  id: string;
  name: string;
  value: string;
  text: string;
  hintText: string;
}

export const RadioListItem: FunctionComponent<RadioListItemProps> = ({
  id,
  name,
  value,
  text,
}: RadioListItemProps): JSX.Element => (
  <div className="govuk-radios__item">
    <input
      className="govuk-radios__input"
      id={id}
      name={name}
      type="radio"
      value={value}
    />
    <FormLabel className="govuk-radios__label" htmlFor={id}>
      {text}
    </FormLabel>
  </div>
);

export const RadioListItemHint: FunctionComponent<RadioListItemHintProps> = ({
  id,
  name,
  value,
  text,
  hintText,
}: RadioListItemHintProps): JSX.Element => (
  <div className="govuk-radios__item">
    <input
      className="govuk-radios__input"
      id={id}
      name={name}
      type="radio"
      value={value}
      aria-describedby={`${id}-hint`}
    />
    <FormLabel className="govuk-radios__label" htmlFor={id}>
      {text}
    </FormLabel>

    <FormHint forId={id} className="govuk-radios__hint">
      {hintText}
    </FormHint>
  </div>
);

export const RadioList: FunctionComponent<RadioListProps> = ({
  className = "",
  children,
}: RadioListProps): JSX.Element => (
  <div className={`govuk-radios ${className}`}>{children}</div>
);
