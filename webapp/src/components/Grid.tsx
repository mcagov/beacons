import React, { FunctionComponent, ReactNode } from "react";

interface GridProps {
  mainContent: ReactNode;
  aside?: ReactNode;
}

export const Grid: FunctionComponent<GridProps> = ({
  mainContent,
  aside = null,
}: GridProps) => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">{mainContent}</div>

    {aside && <div className="govuk-grid-column-one-third">{aside}</div>}
  </div>
);
