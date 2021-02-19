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
  FormLabel,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { AnchorLink } from "../../components/Typography";

const VesselCommunications: FunctionComponent = (): JSX.Element => (
  <Layout
    navigation={<BackButton href="/register-a-beacon/about-the-vessel" />}
  >
    <Grid
      mainContent={
        <>
          <VesselCommunicationsForm />

          <IfYouNeedHelp />
        </>
      }
    ></Grid>
  </Layout>
);

export const VesselCommunicationsForm: FunctionComponent = () => (
  <Form action="/register-a-beacon/vessel-communications">
    <FormFieldset ariaDescribedBy="vessel-hint">
      <FormLegendPageHeading>
        What types of communications are on board the vessel?
      </FormLegendPageHeading>

      <FormHint forId="vessel-hint">
        Details about the onboard communications will be critical for Search{" "}
        {"&"} Rescue when trying to contact you in an emergency.
      </FormHint>

      <FormHint forId="vessel-hint">
        If you have a radio license and have a VHF and/or VHF/DSC radio, you can{" "}
        <AnchorLink href="https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/ships-radio">
          look up your call sign and MMSI number on the OFCOM website.
        </AnchorLink>
      </FormHint>
    </FormFieldset>

    <CallSign />

    <TypesOfCommunication />

    <Button buttonText="Continue" />
  </Form>
);

const CallSign: FunctionComponent = () => (
  <>
    <FormGroup className="govuk-!-margin-top-4">
      <FormLabel htmlFor="vesselCallSign">
        Vessel call sign (optional)
      </FormLabel>
      <FormHint forId="vesselCallSign">
        This is the unique call sign associated to this vessel
      </FormHint>
      <Input id="vesselCallSign" name="vesselCallSign" numOfChars={20} />
    </FormGroup>
  </>
);

const TypesOfCommunication: FunctionComponent = () => (
  <FormGroup>
    <FormLabel htmlFor="typesOfCommunication">
      Types of communication devices onboard
    </FormLabel>

    <FormHint forId="typesOfCommunication">
      Tick all that apply and provide as much detail as you can
    </FormHint>

    <CheckboxListConditional>
      <CheckboxListItem id="vhfRadio" name="vhfRadio" value="">
        VHF Radio
      </CheckboxListItem>
      <CheckboxListItemConditional
        id="fixedVhfRadio"
        name="fixedVhfRadio"
        checkboxLabel="Fixed VHF/DSC Radio"
      >
        <Input
          id="fixedVhfRadioInput"
          label="Fixed MMSI number (optional)"
          hintText="This is the unique MMSI number associated to the vessel, it is 9
          digits long"
        />
      </CheckboxListItemConditional>
      <CheckboxListItem id="portableVhfRadio" name="portableVhfRadio" value="">
        Portable VHF/DSC Radio
      </CheckboxListItem>
      <CheckboxListItem
        id="satelliteTelephone"
        name="satelliteTelephone"
        value=""
      >
        Satellite Telephone
      </CheckboxListItem>
      <CheckboxListItem id="mobileTelephone" name="mobileTelephone" value="">
        Mobile Telephone(s)
      </CheckboxListItem>
    </CheckboxListConditional>
  </FormGroup>
);

export default VesselCommunications;
