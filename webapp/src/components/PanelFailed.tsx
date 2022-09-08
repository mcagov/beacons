import React, { ReactNode } from "react";

export const PanelFailed = (props: { children?: ReactNode }): JSX.Element => (
  <div
    className="govuk-error-summary"
    aria-labelledby="error-summary-title"
    role="alert"
    data-module="govuk-error-summary"
  >
    <h2 className="govuk-error-summary__title" id="error-summary-title">
      There is a problem
    </h2>
    <div className="govuk-error-summary__body">
      <ul className="govuk-list govuk-error-summary__list">
        <li>{props.children}</li>
      </ul>
    </div>
  </div>
);
