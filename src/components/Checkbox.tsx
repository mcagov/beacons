import React, { FunctionComponent, ReactNode } from "react";
import { FormGroup, FormHint, FormLabel } from "./Form";

interface CheckboxListProps {
  children: ReactNode;
}

interface CheckboxListConditionalProps {
  className?: string;
  children: ReactNode;
}

interface CheckboxListItemProps {
  id: string;
  value: string;
  children: ReactNode;
  name?: string;
  hintText?: string;
  inputHtmlAttributes?: Record<string, string>;
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
  name: string;
  checkboxLabel: string;
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
    className={`govuk-checkboxes ${className}`}
    data-module="govuk-checkboxes"
  >
    {children}
  </div>
);

export const CheckboxListItem: FunctionComponent<CheckboxListItemProps> = ({
  id,
  value,
  children,
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
        {children}
      </FormLabel>
      {hintComponent}
    </div>
  );
};

export const CheckboxListItemConditional: FunctionComponent<CheckboxListItemConditionalProps> = ({
  id,
  name,
  checkboxLabel,
  children,
}: CheckboxListItemConditionalProps): JSX.Element => {
  const dataAriaControlId: string = `${id}-control`;

  return (
    <>
      <CheckboxListItem
        id={id}
        name={name}
        value=""
        inputHtmlAttributes={{ "data-aria-controls": dataAriaControlId }}
      >
        {checkboxLabel}
      </CheckboxListItem>

      <div
        className="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden"
        id={dataAriaControlId}
      >
        <FormGroup>{children}</FormGroup>
      </div>
    </>
  );
};
