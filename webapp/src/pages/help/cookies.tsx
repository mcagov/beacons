import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent, type JSX } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import {
  AnchorLink,
  GovUKBody,
  PageHeading,
} from "../../components/Typography";
import { acceptRejectCookieId } from "../../lib/types";

interface CookiePageProps {
  showCookieBanner: boolean;
}

const CookiePage: FunctionComponent<CookiePageProps> = ({
  showCookieBanner,
}: CookiePageProps): JSX.Element => {
  const pageHeading = "Cookies on Maritime and Coastguard Agency";
  return (
    <>
      <Layout title={pageHeading} showCookieBanner={showCookieBanner}>
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
    <h2 className="govuk-heading-m">Cookie settings</h2>
    <GovUKBody>We only use 1 type of cookie.</GovUKBody>
  </>
);

const EssentialCookies: FunctionComponent = (): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">Strictly necessary cookies</h2>
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const showCookieBanner = !context.req.cookies[acceptRejectCookieId];

  return {
    props: {
      showCookieBanner,
    },
  };
};
export default CookiePage;
