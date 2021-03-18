import React, { FunctionComponent, ReactNode } from "react";
import { FormHint, FormLabel } from "./Form";

interface RadioListProps {
  children: ReactNode;
  conditional?: boolean;
}

interface RadioListItemProps {
  id: string;
  value: string;
  label: string;
  name?: string;
  children?: ReactNode;
  conditional?: boolean;
  hintText?: string;
  defaultChecked?: boolean;
  inputHtmlAttributes?: Record<string, string | boolean>;
}

export const RadioList: FunctionComponent<RadioListProps> = ({
  children,
  conditional = false,
}: RadioListProps): JSX.Element => {
  const attributes = conditional ? { "data-module": "govuk-radios" } : {};
  const conditionalClassName = conditional ? "govuk-radios--conditional" : "";

  return (
    <div className={`govuk-radios ${conditionalClassName}`} {...attributes}>
      {children}
    </div>
  );
};

export const RadioListItem: FunctionComponent<RadioListItemProps> = ({
  id,
  value,
  label,
  name = null,
  children = null,
  conditional = false,
  hintText = null,
  defaultChecked = false,
  inputHtmlAttributes = {},
}: RadioListItemProps): JSX.Element => {
  name = name ? name : id;

  let hintComponent: ReactNode;
  if (hintText) {
    const ariaDescribedByHint = `${id}-hint`;
    inputHtmlAttributes = {
      ...inputHtmlAttributes,
      "aria-describedby": ariaDescribedByHint,
    };

    hintComponent = (
      <FormHint className="govuk-radios__hint" forId={id}>
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
        className="govuk-radios__conditional govuk-radios__conditional--hidden"
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
      <div className="govuk-radios__item">
        <input
          className="govuk-radios__input"
          id={id}
          name={name}
          type="radio"
          value={value}
          {...inputHtmlAttributes}
        />
        <FormLabel className="govuk-radios__label" htmlFor={id}>
          {label}
        </FormLabel>
        {hintComponent}
      </div>
      {conditionalListItemComponent}
    </>
  );
};
