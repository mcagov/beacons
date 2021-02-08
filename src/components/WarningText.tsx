import React, { FunctionComponent } from "react";

interface WarningTextProps {
  text: string;
}

export const WarningText: FunctionComponent<WarningTextProps> = ({
  text,
}: WarningTextProps): JSX.Element => (
  <div className="govuk-warning-text">
    <span className="govuk-warning-text__icon" aria-hidden="true">
      !
    </span>
    <strong className="govuk-warning-text__text">
      <span className="govuk-warning-text__assistive">Warning</span>
      {text}
    </strong>
  </div>
);
