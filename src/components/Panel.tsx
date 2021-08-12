import React, { FunctionComponent, ReactNode } from "react";

interface PanelBannerProps {
  title: string;
  children?: ReactNode;
  reference?: string;
  styles?: Record<string, string>;
}

export const Panel: FunctionComponent<PanelBannerProps> = ({
  title,
  children,
  reference,
  styles = {},
}: PanelBannerProps): JSX.Element => (
  <div className="govuk-panel govuk-panel--confirmation" style={styles}>
    <h1 className="govuk-panel__title">{title}</h1>
    <div className="govuk-panel__body">{children}</div>
    {reference && (
      <div className="govuk-panel__body">Reference ID: {reference}</div>
    )}
  </div>
);
