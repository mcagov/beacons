import React, { FunctionComponent, ReactNode } from "react";

interface AProps {
  href: string;
  children: ReactNode;
}

export const A: FunctionComponent<AProps> = ({
  href,
  children,
}: AProps): JSX.Element => (
  <a href={href} className="govuk-link">
    {children}
  </a>
);
