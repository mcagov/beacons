import React, { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import Link from "next/link";

export const BreadcrumbList: FunctionComponent = ({
  children,
}: PropsWithChildren<{}>) => (
  <div className="govuk-breadcrumbs ">
    <ol className="govuk-breadcrumbs__list">{children}</ol>
  </div>
);

interface BreadcrumListItemProps {
  children: ReactNode;
  link?: string;
  nextJSLink?: boolean;
}

export const BreadcrumListItem: FunctionComponent<BreadcrumListItemProps> = ({
  children,
  link = "#",
  nextJSLink = true,
}: BreadcrumListItemProps): JSX.Element => {
  const anchorElement: JSX.Element = nextJSLink ? (
    <NextJSLink link={link}>{children} </NextJSLink>
  ) : (
    <AnchorLink link={link}>{children}</AnchorLink>
  );

  return <li className="govuk-breadcrumbs__list_item">{anchorElement}</li>;
};

interface AnchorProps {
  children: ReactNode;
  link?: string;
}

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
