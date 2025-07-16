import React, { FunctionComponent, ReactNode, type JSX } from "react";

interface InsetTextProps {
  children: ReactNode;
}

export const InsetText: FunctionComponent<InsetTextProps> = ({
  children,
}: InsetTextProps): JSX.Element => (
  <div className="govuk-inset-text">{children}</div>
);
