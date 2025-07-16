import React, { FunctionComponent, ReactNode, type JSX } from "react";
import { FormHint, FormLabel } from "./Form";

interface CheckboxListProps {
  children: ReactNode;
  conditional?: boolean;
}

interface CheckboxListItemProps {
  id: string;
  value?: string;
  label: string;
  defaultChecked?: boolean;
  children?: ReactNode;
  conditional?: boolean;
  name?: string;
  hintText?: string;
  inputHtmlAttributes?: Record<string, string | boolean>;
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
  label,
  value = "true",
  defaultChecked = false,
  children = null,
  conditional = false,
  name = null,
  hintText = null,
  inputHtmlAttributes = {},
}: CheckboxListItemProps): JSX.Element => {
  name = name ? name : id;

  let hintComponent: ReactNode;
  if (hintText) {
    hintComponent = (
      <FormHint className="govuk-checkboxes__hint" forId={id}>
        {hintText}
      </FormHint>
    );
  }

  let conditionalListItemComponent: ReactNode;
  if (conditional) {
    const dataAriaControlId = `${id}-control`;
    inputHtmlAttributes = {
      ...inputHtmlAttributes,
      "data-aria-controls": dataAriaControlId,
    };

    conditionalListItemComponent = (
      <div
        className="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden"
        id={dataAriaControlId}
      >
        {children}
      </div>
    );
  }

  inputHtmlAttributes = {
    ...inputHtmlAttributes,
    defaultChecked,
  };

  return (
    <>
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

      {conditionalListItemComponent}
    </>
  );
};
