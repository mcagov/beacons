import React, { FunctionComponent } from "react";
import { Button } from "./Button";
import { Form } from "./Form";

export type CookiesCacheEntry = { accepted: boolean };

interface CookieBannerProps {
  action?: string;
  acceptRejectCookiesState: boolean;
}

export const CookieBanner: FunctionComponent<CookieBannerProps> = ({
  action = "/api/check-cookie-state",
  acceptRejectCookiesState = false,
}: CookieBannerProps): JSX.Element => (
  <>
    {!acceptRejectCookiesState ? (
      <Form action={action}>
        <div
          className="govuk-cookie-banner "
          role="region"
          aria-label="Cookies on Maritime and Coastguard Agency"
        >
          <div className="govuk-cookie-banner__message govuk-width-container">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">
                <h2 className="govuk-cookie-banner__heading govuk-heading-m">
                  Cookies on Maritime and Coastguard Agency
                </h2>
                <div className="govuk-cookie-banner__content">
                  <p className="govuk-body">
                    We use some essential cookies to make this service work.
                  </p>
                </div>
              </div>
            </div>
            <div className="govuk-button-group">
              <a className="govuk-link" href="/help/cookies">
                View cookies
              </a>
              <Button buttonText="Hide this message" />
            </div>
          </div>
        </div>
      </Form>
    ) : (
      ""
    )}
  </>
);
