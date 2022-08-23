import React, { FunctionComponent, ReactNode } from "react";

export interface NotificationBannerProps {
  isErrorMessage: boolean;
  title: string;
  heading: string;
  children: ReactNode;
}

interface NotificationBannerSuccessProps {
  title: string;
  children: ReactNode;
}

export const NotificationBanner: FunctionComponent<NotificationBannerProps> = (
  notificationBannerProps: NotificationBannerProps
): JSX.Element => (
  <div
    className={
      notificationBannerProps.isErrorMessage
        ? "govuk-notification-banner govuk-error-notification-banner"
        : "govuk-notification-banner"
    }
    role="region"
    aria-labelledby="govuk-notification-banner-title"
    data-module="govuk-notification-banner"
  >
    <div className={"govuk-notification-banner__header"}>
      <h2
        className="govuk-notification-banner__title"
        id="govuk-notification-banner-title"
      >
        {notificationBannerProps.title}
      </h2>
    </div>
    <div className="govuk-notification-banner__content">
      <p className="govuk-notification-banner__heading">
        {notificationBannerProps.heading}
      </p>
      {notificationBannerProps.children}
    </div>
  </div>
);

export const NotificationBannerSuccess: FunctionComponent<
  NotificationBannerSuccessProps
> = ({ title, children }: NotificationBannerSuccessProps): JSX.Element => (
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
