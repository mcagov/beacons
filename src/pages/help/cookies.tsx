import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { PageHeading } from "../../components/Typography";
import { FormPageProps } from "../../lib/handlePageRequest";
import { withCookieRedirect } from "../../lib/middleware";

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
    <div className="govuk-body">
      Cookies are files saved on your phone, tablet or computer when you visit a
      website.
    </div>
    <div className="govuk-body">
      We use cookies to store information about how you use the MCA website,
      such as the beacon registration form data.
    </div>
    <div className="govuk-heading-m">Cookie settings</div>
    <div className="govuk-body">We only use 1 type of cookie.</div>
  </>
);

const EssentialCookies: FunctionComponent = (): JSX.Element => (
  <>
    <div className="govuk-heading-m">Strictly necessary cookies</div>
    <div className="govuk-body">
      These essential cookies do things like remember your progress through a
      form (for example a beacon registration)
    </div>
    <div className="govuk-body">They always need to be on.</div>
    <a
      className="govuk-link govuk-body"
      href="https://www.gov.uk/help/cookie-details"
    >
      Find out more about cookies on GOV.UK
    </a>
  </>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async () => {
    return {
      props: {},
    };
  }
);

export default CookiePage;
