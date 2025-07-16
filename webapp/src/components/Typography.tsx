import React, { FunctionComponent, ReactNode, type JSX } from "react";

interface PageHeadingProps {
  children: ReactNode;
}

interface SectionHeadingProps {
  children: ReactNode;
  classes?: string;
}

interface AnchorLinkProps {
  href: string;
  description?: string;
  children: ReactNode;
  classes?: string;
}

interface GovUKBodyProps {
  children: ReactNode;
  className?: string;
}

interface GovUKListProps {
  children: ReactNode;
}

export const PageHeading = (props: PageHeadingProps): JSX.Element => (
  <h1 className="govuk-heading-l">{props.children}</h1>
);

export const SectionHeading: FunctionComponent<SectionHeadingProps> = ({
  children,
  classes = "",
}: SectionHeadingProps): JSX.Element => (
  <h2 className={"govuk-heading-m " + classes}>{children}</h2>
);

export const AnchorLink: FunctionComponent<AnchorLinkProps> = ({
  href,
  description,
  children,
  classes = "",
}: AnchorLinkProps): JSX.Element => (
  <a href={href} className={"govuk-link " + classes}>
    <>
      {children}
      {!!description && (
        <span
          data-testid="anchor-link-description"
          className="govuk-visually-hidden"
        >
          {description}
        </span>
      )}
    </>
  </a>
);

export const WarningLink: FunctionComponent<AnchorLinkProps> = ({
  href,
  description,
  children,
}: AnchorLinkProps): JSX.Element => (
  <a
    href={href}
    className="govuk-link govuk-link--no-visited-state"
    style={{ color: "#d4351c" }}
  >
    <>
      {children}
      {!!description && (
        <span
          data-testid="warning-link-description"
          className="govuk-visually-hidden"
        >
          {description}
        </span>
      )}
    </>
  </a>
);

export const GovUKBody: FunctionComponent<GovUKBodyProps> = ({
  className = "",
  children,
}: GovUKBodyProps): JSX.Element => (
  <p className={`govuk-body ${className}`}>{children}</p>
);

export const GovUKList: FunctionComponent<GovUKListProps> = ({
  children,
}: GovUKListProps): JSX.Element => <ul className="govuk-list">{children}</ul>;

export const GovUKBulletedList: FunctionComponent<GovUKListProps> = ({
  children,
}: GovUKListProps): JSX.Element => (
  <ul className="govuk-list govuk-list--bullet">{children}</ul>
);
