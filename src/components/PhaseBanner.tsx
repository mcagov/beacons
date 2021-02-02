import React, { FunctionComponent, ReactNode } from "react";

interface PhaseBannerProps {
  phase: string;
  children: ReactNode;
}

const PhaseBanner: FunctionComponent<PhaseBannerProps> = ({
  phase,
  children,
}: PhaseBannerProps): JSX.Element => (
  <div className="govuk-phase-banner govuk-width-container">
    <p className="govuk-phase-banner__content">
      <strong className="govuk-tag govuk-phase-banner__content__tag">
        {phase}
      </strong>
      <span className="govuk-phase-banner__text">{children}</span>
    </p>
  </div>
);

export default PhaseBanner;
