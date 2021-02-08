import React, { FunctionComponent, ReactNode } from "react";

interface AnchorLinkProps {
  href: string;
  children: ReactNode;
}

interface GovUKBodyProps {
  children: ReactNode;
}

interface GovUKListProps {
  children: ReactNode;
}

export const AnchorLink: FunctionComponent<AnchorLinkProps> = ({
  href,
  children,
}: AnchorLinkProps): JSX.Element => (
  <a href={href} className="govuk-link">
    {children}
  </a>
);

export const GovUKBody: FunctionComponent<GovUKBodyProps> = ({
  children,
}: GovUKBodyProps): JSX.Element => <p className="govuk-body">{children}</p>;

export const GovUKList: FunctionComponent<GovUKListProps> = ({
  children,
}: GovUKListProps): JSX.Element => <ul className="govuk-list">{children}</ul>;

export const GovUKBulletedList: FunctionComponent<GovUKListProps> = ({
  children,
}: GovUKListProps): JSX.Element => (
  <ul className="govuk-list govuk-list--bullet">{children}</ul>
);
