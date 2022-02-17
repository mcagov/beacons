import React, { FunctionComponent, ReactNode } from "react";

interface DetailsProps {
  summaryText: string;
  children: ReactNode;
  className?: string;
}

export const Details: FunctionComponent<DetailsProps> = ({
  className = null,
  summaryText,
  children,
}: DetailsProps): JSX.Element => (
  <details className={`govuk-details ${className}`} data-module="govuk-details">
    <summary className="govuk-details__summary">
      <span className="govuk-details__summary-text">{summaryText}</span>
    </summary>
    <div className="govuk-details__text">{children}</div>
  </details>
);
