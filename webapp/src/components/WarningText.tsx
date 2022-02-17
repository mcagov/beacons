import React, { FunctionComponent, ReactNode } from "react";

interface WarningTextProps {
  children: ReactNode;
}

export const WarningText: FunctionComponent<WarningTextProps> = ({
  children,
}: WarningTextProps): JSX.Element => (
  <div className="govuk-warning-text">
    <span className="govuk-warning-text__icon" aria-hidden="true">
      !
    </span>
    <strong className="govuk-warning-text__text">
      <span className="govuk-warning-text__assistive">Warning</span>
      {children}
    </strong>
  </div>
);
