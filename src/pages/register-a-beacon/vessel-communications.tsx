import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  CheckboxListConditional,
  CheckboxListItem,
  CheckboxListItemConditional,
} from "../../components/Checkbox";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormHint,
  FormLegend,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import {
  AnchorLink,
  GovUKBody,
  PageHeading,
} from "../../components/Typography";

const VesselCommunications: FunctionComponent = (): JSX.Element => (
  <Layout
    navigation={<BackButton href="/register-a-beacon/about-the-vessel" />}
  >
    <Grid
      mainContent={
        <>
          <PageHeadingInfo />
          <VesselCommunicationsForm />
          <IfYouNeedHelp />
        </>
      }
    ></Grid>
  </Layout>
);

const PageHeadingInfo: FunctionComponent = () => (
  <>
    <PageHeading>
      What types of communications are on board the vessel?
    </PageHeading>

    <GovUKBody>
      Details about the onboard communications will be critical for Search and
      Rescue when trying to contact you in an emergency.
    </GovUKBody>
    <GovUKBody>
      If you have a radio license and have a Very High Frequency (VHF) and/or
      Very High Frequency (VHF) / Digital Selective Calling (DSC) radio, you can
      <AnchorLink href="https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/ships-radio">
        find up your Call Sign and Maritime Mobile Service Identity (MMSI)
        number on the OFCOM website.
      </AnchorLink>
    </GovUKBody>
  </>
);

const VesselCommunicationsForm: FunctionComponent = () => (
  <Form action="/register-a-beacon/vessel-communications">
    <CallSign />

    <TypesOfCommunication />

    <Button buttonText="Continue" />
  </Form>
);

const CallSign: FunctionComponent = () => (
  <>
    <FormGroup className="govuk-!-margin-top-4">
      <Input
        id="vesselCallSign"
        labelClassName="govuk-label--s"
        label="Vessel call sign (optional)"
        hintText="This is the unique call sign associated to this vessel"
        numOfChars={20}
      />
    </FormGroup>
  </>
);

const TypesOfCommunication: FunctionComponent = () => (
  <FormFieldset>
    <FormLegend className="govuk-fieldset__legend--s">
      Types of communication devices onboard
      <FormHint forId="typesOfCommunication">
        Tick all that apply and provide as much detail as you can
      </FormHint>
    </FormLegend>

    <FormGroup>
      <CheckboxListConditional>
        <CheckboxListItem id="vhfRadio" value="" label="VHF Radio" />

        <CheckboxListItemConditional
          id="fixedVhfRadio"
          name="fixedVhfRadio"
          label="Fixed VHF/DSC Radio"
        >
          <Input
            id="fixedVhfRadioInput"
            label="Fixed MMSI number (optional)"
            hintText="This is the unique MMSI number associated to the vessel, it is 9
          digits long"
          />
        </CheckboxListItemConditional>
        <CheckboxListItem
          id="portableVhfRadio"
          value=""
          label="Portable VHF/DSC Radio"
        />
        <CheckboxListItem
          id="satelliteTelephone"
          value=""
          label="Satellite Telephone"
        />
        <CheckboxListItem
          id="mobileTelephone"
          value=""
          label="Mobile Telephone(s)"
        ></CheckboxListItem>
      </CheckboxListConditional>
    </FormGroup>
  </FormFieldset>
);

export default VesselCommunications;
