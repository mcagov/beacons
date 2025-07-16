import React, { FunctionComponent, ReactNode, type JSX } from "react";
import { FormGroup, FormHint, FormLabel } from "./Form";

interface DateListInputProps {
  id: string;
  label: string;
  hintText?: string;
  children: ReactNode;
  errorMessages?: string[];
}

interface DateListItemInputProps {
  id: string;
  label: string;
  dateType: DateType;
  name?: string;
  defaultValue?: string;
  errorMessages?: string[];
}

interface DateInputProps {
  id: string;
  dateType: DateType;
  name?: string;
  defaultValue?: string;
  className?: string;
}

export enum DateType {
  DAY,
  MONTH,
  YEAR,
}

export const DateListInput: FunctionComponent<DateListInputProps> = ({
  id,
  label,
  hintText = "",
  children,
  errorMessages = [],
}: DateListInputProps): JSX.Element => {
  let hintComponent: ReactNode;
  if (hintText) {
    hintComponent = <FormHint forId={id}>{hintText}</FormHint>;
  }

  return (
    <FormGroup errorMessages={errorMessages}>
      <div className="govuk-date-input" id={id}>
        <FormLabel htmlFor={id} className="govuk-date-input__label">
          {label}
        </FormLabel>
        {hintComponent}
        {children}
      </div>
    </FormGroup>
  );
};

export const DateListItem: FunctionComponent<DateListItemInputProps> = ({
  id,
  label,
  dateType,
  name = "",
  defaultValue = "",
  errorMessages = [],
}: DateListItemInputProps): JSX.Element => {
  return (
    <div className="govuk-date-input__item">
      <FormGroup errorMessages={errorMessages}>
        <FormLabel htmlFor={id} className="govuk-date-input__label">
          {label}
        </FormLabel>

        <DateInput
          id={id}
          name={name}
          defaultValue={defaultValue}
          dateType={dateType}
        />
      </FormGroup>
    </div>
  );
};

const DateInput: FunctionComponent<DateInputProps> = ({
  id,
  dateType,
  name = null,
  defaultValue = "",
  className = "",
}: DateInputProps) => {
  const dateTypeClass: string =
    dateType === DateType.YEAR
      ? "govuk-input--width-4"
      : "govuk-input--width-2";

  const maxLength = dateType === DateType.YEAR ? 4 : 2;

  name = name ? name : id;

  return (
    <input
      className={`govuk-input govuk-date-input__input ${dateTypeClass} ${className}`}
      id={id}
      name={name}
      type="text"
      pattern={`[0-9]{${maxLength}}`}
      inputMode="numeric"
      defaultValue={defaultValue}
      {...{ maxLength }}
    />
  );
};
