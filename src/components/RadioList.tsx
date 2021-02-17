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
  children: ReactNode;
}

interface RadioListItemHintProps {
  id: string;
  name: string;
  value: string;
  children: ReactNode;
  hintText: string;
}

interface RadioListItemConditionalProps {
  id: string;
  children: ReactNode;
}

export const RadioList: FunctionComponent<RadioListProps> = ({
  className = "",
  children,
}: RadioListProps): JSX.Element => (
  <div className={`govuk-radios ${className}`}>{children}</div>
);

export const RadioListItem: FunctionComponent<RadioListItemProps> = ({
  id,
  name,
  value,
  children,
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
      {children}
    </FormLabel>
  </div>
);

export const RadioListItemHint: FunctionComponent<RadioListItemHintProps> = ({
  id,
  name,
  value,
  children,
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
      {children}
    </FormLabel>

    <FormHint forId={id} className="govuk-radios__hint">
      {hintText}
    </FormHint>
  </div>
);

export const RadioListItemConditional: FunctionComponent<RadioListItemConditionalProps> = ({
  id,
  children,
}: RadioListItemConditionalProps): JSX.Element => (
  <div
    className="govuk-radios__conditional govuk-radios__conditional--hidden"
    id={id}
  >
    {children}
  </div>
);
