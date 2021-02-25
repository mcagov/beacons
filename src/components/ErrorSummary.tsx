import React, { FunctionComponent, ReactNode } from "react";
import { IFormError } from "../lib/formValidator";

interface FormErrorSummaryProps {
  needsValidation: boolean;
  errors: IFormError[];
}

interface FormErrorSummaryLinkProps {
  href: string;
  errorMessage: string;
}

interface FieldErrorListProps {
  errorMessages: string[];
}

interface FieldErrorMessageProps {
  errorMessage: string;
}

interface ErrorSummaryProps {
  children: ReactNode;
}

export const FormErrorSummary: FunctionComponent<FormErrorSummaryProps> = ({
  needsValidation,
  errors,
}: FormErrorSummaryProps) => (
  <>
    {needsValidation && errors && errors.length > 0 && (
      <ErrorSummary>
        {errors.map((field) =>
          field.errorMessages.map((errorMessage, index) => (
            <FormErrorSummaryLink
              key={`${field.fieldId}-${index}`}
              href={`#${field.fieldId}`}
              errorMessage={errorMessage}
            />
          ))
        )}
      </ErrorSummary>
    )}
  </>
);

const FormErrorSummaryLink: FunctionComponent<FormErrorSummaryLinkProps> = ({
  href,
  errorMessage,
}: FormErrorSummaryLinkProps) => (
  <li>
    <a href={href}>{errorMessage}</a>
  </li>
);

export const FieldErrorList: FunctionComponent<FieldErrorListProps> = ({
  errorMessages,
}: FieldErrorListProps): JSX.Element => (
  <>
    {errorMessages.map((message, index) => (
      <FieldErrorMessage errorMessage={message} key={`${index}`} />
    ))}
  </>
);

const FieldErrorMessage: FunctionComponent<FieldErrorMessageProps> = ({
  errorMessage,
}: FieldErrorMessageProps) => (
  <span className="govuk-error-message">
    <span className="govuk-visually-hidden">Error:</span>
    {errorMessage}
  </span>
);

const ErrorSummary: FunctionComponent<ErrorSummaryProps> = ({
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
