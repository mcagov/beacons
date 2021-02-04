import React, { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import Link from "next/link";

interface BreadcrumListItemProps {
  children: ReactNode;
  link?: string;
  nextJSLink?: boolean;
}

interface AnchorProps {
  children: ReactNode;
  link?: string;
}

export const BreadcrumbList: FunctionComponent = ({
  children,
}: PropsWithChildren<Record<string, string>>) => (
  <div className="govuk-breadcrumbs ">
    <ol className="govuk-breadcrumbs__list">{children}</ol>
  </div>
);

export const BreadcrumListItem: FunctionComponent<BreadcrumListItemProps> = ({
  children,
  link = "#",
  nextJSLink = true,
}: BreadcrumListItemProps): JSX.Element => {
  const anchorElement: JSX.Element = nextJSLink ? (
    <NextJSLink link={link}>{children}</NextJSLink>
  ) : (
    <AnchorLink link={link}>{children}</AnchorLink>
  );

  return <li className="govuk-breadcrumbs__list-item">{anchorElement}</li>;
};

const NextJSLink: FunctionComponent<AnchorProps> = ({
  children,
  link,
}: AnchorProps) => (
  <Link href={link}>
    <a className="govuk-breadcrumbs__link">{children}</a>
  </Link>
);

const AnchorLink: FunctionComponent<AnchorProps> = ({
  children,
  link,
}: AnchorProps) => (
  <a className="govuk-breadcrumbs__link" href={link}>
    {children}
  </a>
);
