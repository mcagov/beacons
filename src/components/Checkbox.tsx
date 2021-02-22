import React, { FunctionComponent, ReactNode } from "react";
import { FormGroup, FormHint, FormLabel } from "./Form";

interface CheckboxListProps {
  children: ReactNode;
  conditional?: boolean;
}

interface CheckboxListItemProps {
  id: string;
  value: string;
  label: string;
  name?: string;
  hintText?: string;
  inputHtmlAttributes?: Record<string, string>;
}

interface CheckboxListItemConditionalProps {
  id: string;
  name: string;
  label: string;
  children: ReactNode;
}

export const CheckboxList: FunctionComponent<CheckboxListProps> = ({
  conditional = false,
  children,
}: CheckboxListProps): JSX.Element => {
  const attributes = conditional ? { "data-module": "govuk-checkboxes" } : {};

  return (
    <div className="govuk-checkboxes" {...attributes}>
      {children}
    </div>
  );
};

export const CheckboxListItem: FunctionComponent<CheckboxListItemProps> = ({
  id,
  value,
  label,
  name = null,
  hintText = null,
  inputHtmlAttributes = {},
}: CheckboxListItemProps): JSX.Element => {
  name = name ? name : id;

  let hintComponent: ReactNode;
  if (hintComponent) {
    hintComponent = (
      <FormHint className="govuk-checkboxes__hint" forId={id}>
        {hintText}
      </FormHint>
    );
  }

  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id={id}
        name={name}
        type="checkbox"
        value={value}
        {...inputHtmlAttributes}
      />
      <FormLabel className="govuk-checkboxes__label" htmlFor={id}>
        {label}
      </FormLabel>
      {hintComponent}
    </div>
  );
};

export const CheckboxListItemConditional: FunctionComponent<CheckboxListItemConditionalProps> = ({
  id,
  name,
  label,
  children,
}: CheckboxListItemConditionalProps): JSX.Element => {
  const dataAriaControlId = `${id}-control`;

  return (
    <>
      <CheckboxListItem
        id={id}
        name={name}
        value=""
        label={label}
        inputHtmlAttributes={{ "data-aria-controls": dataAriaControlId }}
      />

      <div
        className="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden"
        id={dataAriaControlId}
      >
        <FormGroup>{children}</FormGroup>
      </div>
    </>
  );
};
