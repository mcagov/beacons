import React, { FunctionComponent, ReactNode } from "react";
import { FormHint, FormLabel } from "./Form";

interface RadioListProps {
  className?: string;
  children: ReactNode;
}

interface RadioListConditionalProps {
  className?: string;
  children: ReactNode;
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

interface RadioListItemHintProps {
  id: string;
  name: string;
  value: string;
  children: ReactNode;
  hintText: string;
  inputHtmlAttributes?: Record<string, string | boolean>;
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

export const RadioListConditional: FunctionComponent<RadioListConditionalProps> = ({
  className = "",
  children,
}: RadioListProps): JSX.Element => (
  <div
    className={`govuk-radios govuk-radios--conditional ${className}`}
    data-module="govuk-radios"
  >
    {children}
  </div>
);

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

export const RadioListItemHint: FunctionComponent<RadioListItemHintProps> = ({
  id,
  name,
  value,
  children,
  hintText,
  inputHtmlAttributes = {},
}: RadioListItemHintProps): JSX.Element => (
  <div className="govuk-radios__item">
    <input
      className="govuk-radios__input"
      id={id}
      name={name}
      type="radio"
      value={value}
      aria-describedby={`${id}-hint`}
      {...inputHtmlAttributes}
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
