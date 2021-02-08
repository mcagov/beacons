import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLegend,
  FormLabel,
  FormGroup,
  Select,
  SelectOption,
  FormHint,
} from "../../components/Form";
import { Details } from "../../components/Details";
import { A } from "../../components/Typography";

const CheckBeaconDetails: FunctionComponent = () => (
  <>
    <Layout navigation={<BackButton href="/intent" />}>
      <Grid
        mainContent={
          <>
            <Form action="/register-a-beacon/check-beacon-summary">
              <FormFieldset>
                <FormLegend>Check beacon details</FormLegend>
                <InsetText>
                  The details of your beacon must be checked to ensure they have
                  a UK encoding and if they are already registered with this
                  service.
                </InsetText>

                <BeaconManufacturerSelect />

                <BeaconModelSelect />

                <BeaconHexIdInput />
              </FormFieldset>
              <Button buttonText="Submit" />
            </Form>
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  </>
);

const BeaconManufacturerSelect: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="beaconManufacturer">
      Select your beacon manufacturer
    </FormLabel>
    <Select
      name="beaconManufacturer"
      id="beaconManufactuere"
      defaultValue="default"
    >
      <option hidden disabled value="default">
        Beacon manufacturer
      </option>
      <SelectOption value="Raleigh">Raleigh</SelectOption>
      <SelectOption value="Giant">Giant</SelectOption>
      <SelectOption value="Trek">Trek</SelectOption>
    </Select>
  </FormGroup>
);

const BeaconModelSelect: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="beaconModel">Select your beacon model</FormLabel>
    <Select name="beaconModel" id="beaconModel" defaultValue="default">
      <option hidden disabled value="default">
        Beacon model
      </option>
      <SelectOption value="Chopper">Chopper</SelectOption>
      <SelectOption value="TCR">TCR</SelectOption>
      <SelectOption value="Madone">Madone</SelectOption>
    </Select>
  </FormGroup>
);

const BeaconHexIdInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="beaconHexId">
      Enter the 15 digit beacon HEX ID
    </FormLabel>
    <FormHint id="beaconHexId">
      This will be on your beacon. It must be 15 characters long and use
      characters 0-9, A-F
    </FormHint>
    <Input name="beaconHexId" id="beaconHexId" spellCheck={false} />
    <br />
    <br />
    <Details summaryText="What does the 15 digit beacon HEX ID look like?">
      TODO: Image of a beacon showing hex ID
    </Details>
  </FormGroup>
);

const IfYouNeedHelp: FunctionComponent = (): JSX.Element => (
  <Details summaryText="If you need help completing this form">
    <p>
      <b>The UK Beacon Registry</b>
      <br />
      <A href="mailto:ukbeacons@mcga.gov.uk">ukbeacons@mcga.gov.uk</A>
      <br />
      Telephone: 01326 211569 <br />
      Fax: 01326 319264 <br />
      Monday to Friday, 9am to 5pm (except public holidays)
      <br />
    </p>
    <p>
      <A href="https://www.gov.uk/call-charges">Find out about call charges</A>
    </p>
    <p>
      In an emergency in the UK, dial 999 and ask for the Coastguard. If you are
      at sea, use GMDSS systems to make a distress or urgency alert:Emergency
      Contact - Dial 999 and ask for the Coastguard
    </p>
  </Details>
);

export default CheckBeaconDetails;
