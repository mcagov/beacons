import React, { FunctionComponent, ReactNode } from "react";
import { FormLabel } from "./Form";

interface CheckboxListProps {
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

export const CheckboxList: FunctionComponent<CheckboxListProps> = ({
  children,
}: CheckboxListProps): JSX.Element => (
  <div className="govuk-checkboxes">{children}</div>
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
