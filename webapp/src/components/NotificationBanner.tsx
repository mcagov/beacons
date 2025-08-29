import React, { FunctionComponent, ReactNode, type JSX } from "react";

export interface NotificationBannerProps {
  isErrorMessage: boolean;
  title: string;
  heading: string;
  children?: ReactNode;
}

interface NotificationBannerSuccessProps {
  title: string;
  children: ReactNode;
}

export const NotificationBanner: FunctionComponent<NotificationBannerProps> = ({
  isErrorMessage,
  title,
  heading,
  children,
}: NotificationBannerProps): JSX.Element => (
  <div
    className={
      isErrorMessage
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
        {title}
      </h2>
    </div>
    <div className="govuk-notification-banner__content">
      <p className="govuk-notification-banner__heading">{heading}</p>
      {children}
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
