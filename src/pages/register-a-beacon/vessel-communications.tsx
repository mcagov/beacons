import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  Form,
  FormFieldset,
  FormHint,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { AnchorLink } from "../../components/Typography";

const VesselCommunications: FunctionComponent = (): JSX.Element => (
  <Layout
    navigation={<BackButton href="/register-a-beacon/about-the-vessel" />}
  >
    <Grid
      mainContent={
        <>
          <Form action="/register-a-beacon/vessel-communications">
            <FormFieldset ariaDescribedBy="vessel-hint">
              <FormLegendPageHeading>
                What types of communications are on board the vessel?
              </FormLegendPageHeading>

              <FormHint forId="vessel-hint">
                Details about the onboard communications will be critical for
                Search {"&"} Rescue when trying to contact you in an emergency.
              </FormHint>

              <FormHint forId="vessel-hint">
                If you have a radio license and have a VHF and/or VHF/DSC radio,
                you can{" "}
                <AnchorLink href="https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/ships-radio">
                  look up your call sign and MMSI number on the OFCOM website.
                </AnchorLink>
              </FormHint>
            </FormFieldset>

            <Button buttonText="Continue" />
          </Form>
        </>
      }
    ></Grid>
  </Layout>
);

export default VesselCommunications;
