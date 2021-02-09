import React, { FunctionComponent, ReactNode } from "react";

interface ErrorSummaryProps {
  children: ReactNode;
}

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
