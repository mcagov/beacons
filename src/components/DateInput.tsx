import React, { FunctionComponent, ReactNode } from "react";

interface DateListInputProps {
  id: string;
  children: ReactNode;
}

interface DateListItemInputProps {
  children: ReactNode;
}

interface DateInputProps {
  id: string;
  dateType: DateType;
  name?: string;
  className?: string;
}

export enum DateType {
  DAY,
  MONTH,
  YEAR,
}

export const DateListInput: FunctionComponent<DateListInputProps> = ({
  id,
  children,
}: DateListInputProps): JSX.Element => (
  <div className="govuk-date-input" id={id}>
    {children}
  </div>
);

export const DateListItem: FunctionComponent<DateListItemInputProps> = ({
  children,
}: DateListItemInputProps): JSX.Element => (
  <div className="govuk-date-input__item">{children}</div>
);

export const DateInput: FunctionComponent<DateInputProps> = ({
  id,
  dateType,
  name = null,
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
      {...{ maxLength }}
    />
  );
};
