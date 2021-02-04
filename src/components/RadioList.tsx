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
  hintText?: string;
}

export const RadioListItem: FunctionComponent<RadioListItemProps> = ({
  id,
  name,
  value,
  text,
  hintText = null,
}: RadioListItemProps): JSX.Element => (
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

    {hintText !== null && (
      <FormHint id={id} className="govuk-radios__hint">
        {hintText}
      </FormHint>
    )}
  </div>
);

export const RadioList: FunctionComponent<RadioListProps> = ({
  className = "",
  children,
}: RadioListProps): JSX.Element => (
  <div className={`govuk-radios ${className}`}>{children}</div>
);
