import React, { FunctionComponent, ReactNode } from "react";

interface SummaryListProps {
  children: ReactNode;
}

interface SummaryListItemAction {
  text: string;
  href: string;
}

interface SummaryListItemProps {
  labelText: string;
  children: ReactNode;
  actions?: SummaryListItemAction[];
}

export const SummaryList: FunctionComponent<SummaryListProps> = ({
  children,
}: SummaryListProps): JSX.Element => (
  <dl className="govuk-summary-list">{children}</dl>
);

export const SummaryListItem: FunctionComponent<SummaryListItemProps> = ({
  labelText,
  children,
  actions = [],
}: SummaryListItemProps): JSX.Element => (
  <div className="govuk-summary-list__row">
    <dt className="govuk-summary-list__key">{labelText}</dt>
    <dd className="govuk-summary-list__value">{children}</dd>
    {actions.map(({ text, href }, i) => (
      <dd className="govuk-summary-list__actions" key={i}>
        <a className="govuk-link" href={href}>
          {text}
          <span className="govuk-visually-hidden">{href}</span>
        </a>
      </dd>
    ))}
  </div>
);
