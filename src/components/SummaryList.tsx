import React, { FunctionComponent, ReactNode } from "react";

interface SummaryListProps {
  children: ReactNode;
}

interface SummaryListItemProps {
  labelText: string;
  children: ReactNode;
  href?: string;
  actionText?: string;
  actionValue?: string;
}

export const SummaryList: FunctionComponent<SummaryListProps> = ({
  children,
}: SummaryListProps): JSX.Element => (
  <dl className="govuk-summary-list">{children}</dl>
);

export const SummaryListItem: FunctionComponent<SummaryListItemProps> = ({
  labelText,
  children,
  href,
  actionText,
  actionValue,
}: SummaryListItemProps): JSX.Element => (
  <div className="govuk-summary-list__row">
    <dt className="govuk-summary-list__key">{labelText}</dt>
    <dd className="govuk-summary-list__value">{children}</dd>
    {actionText && actionValue && (
      <dd className="govuk-summary-list__actions">
        <a className="govuk-link" href={href}>
          {actionText}
          <span className="govuk-visually-hidden"> {actionValue}</span>
        </a>
      </dd>
    )}
  </div>
);
