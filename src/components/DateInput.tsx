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
  name: string;
  dateType: DateType;
  children: ReactNode;
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
  name,
  dateType,
  children,
  className = "",
}: DateInputProps) => {
  const dateTypeClass: string =
    "govuk-input--" + (dateType === DateType.YEAR) ? "width-4" : "width-2";

  return (
    <input
      className={`govuk-input govuk-date-input__input ${dateTypeClass} ${className}`}
      id={id}
      name={name}
      type="text"
      pattern="[0-9]*"
      inputMode="numeric"
    >
      {children}
    </input>
  );
};
