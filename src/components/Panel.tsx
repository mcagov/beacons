import React, { FunctionComponent, ReactNode } from "react";

interface PanelBannerProps {
  title: string;
  children: ReactNode;
  reference: string;
}

export const Panel: FunctionComponent<PanelBannerProps> = ({
  title,
  children,
  reference,
}: PanelBannerProps): JSX.Element => (
  <div className="govuk-panel govuk-panel--confirmation">
    <h1 className="govuk-panel__title">{title}</h1>
    <div className="govuk-panel__body">{children}</div>
    <div className="govuk-panel__body">Reference ID: {reference}</div>
  </div>
);
