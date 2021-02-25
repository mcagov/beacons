import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  Form,
  FormFieldset,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { handlePageRequest } from "../../lib/handlePageRequest";

const BeaconOwnerAddressPage: FunctionComponent = (): JSX.Element => {
  const pageHeading = "What is the beacon owner's address";

  const pageHasErrors = false;

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/about-beacon-owner" />}
      title={pageHeading}
      pageHasErrors={pageHasErrors}
    >
      <Grid
        mainContent={
          <>
            <Form action="/register-a-beacon/beacon-owner-address">
              <FormFieldset>
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <InsetText>
                  The beacon registration certificate and proof of registration
                  labels to stick to the beacon will be sent to this address
                </InsetText>
              </FormFieldset>
              <Button buttonText="Continue" />
              <IfYouNeedHelp />
            </Form>
          </>
        }
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/emergency-contact"
);

export default BeaconOwnerAddressPage;
