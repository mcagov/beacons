import React, { FunctionComponent, ReactNode } from "react";
import { FormLabel } from "./Form";

interface CheckboxListProps {
  children: ReactNode;
}

interface CheckboxListConditionalProps {
  className?: string;
  children: ReactNode;
}

interface CheckboxListItemProps {
  id: string;
  name: string;
  value: string;
  children: ReactNode;
}

interface CheckboxListItemHintProps {
  id: string;
  name: string;
  value: string;
  hintText: string;
  children: ReactNode;
}

interface CheckboxListItemConditionalProps {
  id: string;
  children: ReactNode;
}

export const CheckboxList: FunctionComponent<CheckboxListProps> = ({
  children,
}: CheckboxListProps): JSX.Element => (
  <div className="govuk-checkboxes">{children}</div>
);

export const CheckboxListConditional: FunctionComponent<CheckboxListConditionalProps> = ({
  className = "",
  children,
}: CheckboxListConditionalProps): JSX.Element => (
  <div
    className={`govuk-checkboxes__conditional govuk-radios--conditional ${className}`}
    data-module="govuk-checkboxes"
  >
    {children}
  </div>
);

export const CheckboxListItem: FunctionComponent<CheckboxListItemProps> = ({
  id,
  name,
  value,
  children,
}: CheckboxListItemProps): JSX.Element => (
  <div className="govuk-checkboxes__item">
    <input
      className="govuk-checkboxes__input"
      id={id}
      name={name}
      type="checkbox"
      value={value}
    />
    <FormLabel className="govuk-checkboxes__label" htmlFor={id}>
      {children}
    </FormLabel>
  </div>
);

export const CheckboxListItemHint: FunctionComponent<CheckboxListItemHintProps> = ({
  id,
  name,
  value,
  hintText,
  children,
}: CheckboxListItemHintProps): JSX.Element => (
  <div className="govuk-checkboxes__item">
    <input
      className="govuk-checkboxes__input"
      id={id}
      name={name}
      type="checkbox"
      value={value}
      aria-describedby={`${id}-hint`}
    />
    <FormLabel className="govuk-checkboxes__label" htmlFor={id}>
      {hintText}
    </FormLabel>

    <FormLabel className="govuk-checkboxes__label" htmlFor={id}>
      {children}
    </FormLabel>
  </div>
);

export const CheckboxListItemConditional: FunctionComponent<CheckboxListItemConditionalProps> = ({
  id,
  children,
}: CheckboxListItemConditionalProps): JSX.Element => (
  <div
    className="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden"
    id={id}
  >
    {children}
  </div>
);
