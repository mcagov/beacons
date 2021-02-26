import React, { FunctionComponent } from "react";
import { Button, ButtonGroup } from "./Button";
import { Form } from "./Form";
import { Grid } from "./Grid";
import { AnchorLink, GovUKBody } from "./Typography";

export type CookiesCacheEntry = { accepted: boolean };

export const CookieBanner: FunctionComponent = (): JSX.Element => (
  <>
    <Form action="/api/check-cookie-state">
      <div
        className="govuk-cookie-banner "
        role="region"
        aria-label="Cookies on Maritime and Coastguard Agency"
      >
        <div className="govuk-cookie-banner__message govuk-width-container">
          <Grid
            mainContent={
              <>
                <h2 className="govuk-cookie-banner__heading govuk-heading-m">
                  Cookies on Maritime and Coastguard Agency
                </h2>
                <div className="govuk-cookie-banner__content">
                  <GovUKBody>
                    We use some essential cookies to make this service work.
                  </GovUKBody>
                </div>
              </>
            }
          />

          <ButtonGroup>
            <AnchorLink href="/help/cookies">View cookies</AnchorLink>
            <Button buttonText="Hide this message" />
          </ButtonGroup>
        </div>
      </div>
    </Form>
  </>
);
