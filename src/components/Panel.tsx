import React, { FunctionComponent, ReactNode } from "react";

interface PanelBannerProps {
  title: string;
  children: ReactNode;
}

export const Panel: FunctionComponent<PanelBannerProps> = ({
  title,
  children,
}: PanelBannerProps): JSX.Element => (
  <div className="govuk-panel govuk-panel--confirmation">
    <h1 className="govuk-panel__title">{title}</h1>
    <div className="govuk-panel__body">{children}</div>
  </div>
);
