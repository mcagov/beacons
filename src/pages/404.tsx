import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { BeaconRegistryContactInfo } from "../components/Mca";
import { GovUKBody } from "../components/Typography";
import { acceptRejectCookieId } from "../lib/types";

interface FourOhFourProps {
  showCookieBanner: boolean;
}

const FourOhFour: FunctionComponent<FourOhFourProps> = ({
  showCookieBanner,
}: FourOhFourProps): JSX.Element => {
  const pageHeading = "Page not found";

  return (
    <Layout
      title={pageHeading}
      pageHasErrors={false}
      showCookieBanner={showCookieBanner}
    >
      <Grid
        mainContent={
          <>
            <h1 className="govuk-heading-l">{pageHeading}</h1>
            <GovUKBody>
              If you typed the web address, check it is correct.
            </GovUKBody>
            <GovUKBody>
              If you pasted the web address, check you copied the entire
              address.
            </GovUKBody>
            <GovUKBody>
              If the web address is correct or you selected a link or button,
              use the details below if you need to speak to someone about your
              beacon.
            </GovUKBody>
            <h2 className="govuk-heading-m">Contact the UK Beacon Registry</h2>
            <BeaconRegistryContactInfo />
          </>
        }
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const showCookieBanner = !context.req.cookies[acceptRejectCookieId];

  return {
    props: {
      showCookieBanner,
    },
  };
};

export default FourOhFour;
