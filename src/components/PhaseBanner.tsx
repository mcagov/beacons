import React from "react";

interface PhaseBannerProps {
  phase: string;
  bannerHtml: JSX.Element;
}

export const PhaseBanner: React.FC<PhaseBannerProps> = ({
  phase,
  bannerHtml,
}: PhaseBannerProps): JSX.Element => (
  <div className="govuk-phase-banner govuk-width-container">
    <p className="govuk-phase-banner__content">
      <strong className="govuk-tag govuk-phase-banner__content__tag">
        {phase}
      </strong>
      <span className="govuk-phase-banner__text">{bannerHtml}</span>
    </p>
  </div>
);
