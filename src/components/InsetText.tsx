import React, { FunctionComponent, ReactNode } from "react";

interface InsetTextProps {
  children: ReactNode;
}

export const InsetText: FunctionComponent<InsetTextProps> = ({
  children,
}: InsetTextProps): JSX.Element => (
  <p className="govuk-inset-text">{children}</p>
);
