import React, { FunctionComponent, ReactNode } from "react";
import { IFormError } from "../lib/formValidator";

interface ErrorSummaryProps {
  children: ReactNode;
}

interface FormErrorSummaryProps {
  errors: IFormError[];
}

interface ErrorListItemProps {
  key: string;
  href: string;
  errorMessage: string;
}

export const FormErrorSummary: FunctionComponent<FormErrorSummaryProps> = ({
  errors,
}: FormErrorSummaryProps) => (
  <>
    {errors && errors.length > 0 && (
      <ErrorSummary>
        {errors.map((field) =>
          field.errors.map((error, index) => (
            <ErrorListItem
              key={`${field.fieldId}-${index}`}
              href={`#${field.fieldId}`}
              errorMessage={error}
            />
          ))
        )}
      </ErrorSummary>
    )}
  </>
);

export const ErrorSummary: FunctionComponent<ErrorSummaryProps> = ({
  children,
}: ErrorSummaryProps): JSX.Element => (
  <div
    className="govuk-error-summary"
    aria-labelledby="error-summary-title"
    role="alert"
    tabIndex={-1}
    data-module="govuk-error-summary"
  >
    <h2 className="govuk-error-summary__title" id="error-summary-title">
      There is a problem
    </h2>
    <div className="govuk-error-summary__body">
      <ul className="govuk-list govuk-error-summary__list">{children}</ul>
    </div>
  </div>
);

const ErrorListItem: FunctionComponent<ErrorListItemProps> = ({
  key,
  href,
  errorMessage,
}: ErrorListItemProps) => (
  <li key={`${key}`}>
    <a href={`#${href}`}>{errorMessage}</a>
  </li>
);
