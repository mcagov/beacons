import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import {
  AnchorLink,
  GovUKBody,
  PageHeading,
} from "../../components/Typography";
import { FormPageProps } from "../../lib/handlePageRequest";

const CookiePage: FunctionComponent<FormPageProps> = ({
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Cookies on Maritime and Coastguard Agency";
  return (
    <>
      <Layout
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <CookieInformation />
              <EssentialCookies />
            </>
          }
        />
      </Layout>
    </>
  );
};

const CookieInformation: FunctionComponent = (): JSX.Element => (
  <>
    <GovUKBody>
      Cookies are files saved on your phone, tablet or computer when you visit a
      website.
    </GovUKBody>
    <GovUKBody>
      We use cookies to store information about how you use the MCA website,
      such as the beacon registration form data.
    </GovUKBody>
    <div className="govuk-heading-m">Cookie settings</div>
    <GovUKBody>We only use 1 type of cookie.</GovUKBody>
  </>
);

const EssentialCookies: FunctionComponent = (): JSX.Element => (
  <>
    <div className="govuk-heading-m">Strictly necessary cookies</div>
    <GovUKBody>
      These essential cookies do things like remember your progress through a
      form (for example a beacon registration)
    </GovUKBody>
    <GovUKBody>They always need to be on.</GovUKBody>
    <GovUKBody>
      <AnchorLink href="https://www.gov.uk/help/cookie-details">
        Find out more about cookies on GOV.UK
      </AnchorLink>
    </GovUKBody>
  </>
);

export default CookiePage;
