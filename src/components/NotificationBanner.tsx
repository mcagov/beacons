import React, { FunctionComponent, ReactNode } from "react";

interface NotificationBannerProps {
  title: string;
  children: ReactNode;
}

export const NotificationBanner: FunctionComponent<NotificationBannerProps> = ({
  title,
  children,
}: NotificationBannerProps): JSX.Element => (
  <div
    className="govuk-notification-banner"
    role="region"
    aria-labelledby="govuk-notification-banner-title"
    data-module="govuk-notification-banner"
  >
    <div className="govuk-notification-banner__header">
      <h2
        className="govuk-notification-banner__title"
        id="govuk-notification-banner-title"
      >
        {title}
      </h2>
    </div>
    <div className="govuk-notification-banner__content">
      <div className="govuk-notification-banner__heading">{children}</div>
    </div>
  </div>
);

export const NotificationBannerSuccess: FunctionComponent<NotificationBannerProps> = ({
  title,
  children,
}): JSX.Element => (
  <div
    className="govuk-notification-banner govuk-notification-banner--success"
    role="alert"
    aria-labelledby="govuk-notification-banner-title"
    data-module="govuk-notification-banner"
  >
    <div className="govuk-notification-banner__header">
      <h2
        className="govuk-notification-banner__title"
        id="govuk-notification-banner-title"
      >
        {title}
      </h2>
    </div>
    <div className="govuk-notification-banner__content">{children}</div>
  </div>
);
