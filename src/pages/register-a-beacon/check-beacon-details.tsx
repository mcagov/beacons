import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLegendPageHeading,
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
                <FormLegendPageHeading>
                  Check beacon details
                </FormLegendPageHeading>
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
    <Select name="beaconManufacturer" id={null} defaultValue="default">
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
    <Input
      name="beaconHexId"
      id="beaconHexId"
      htmlAttributes={{ spellCheck: false }}
    />
    <Details
      summaryText="What does the 15 digit beacon HEX ID look like?"
      className="govuk-!-padding-top-2"
    >
      TODO: Image of a beacon showing hex ID
    </Details>
  </FormGroup>
);

const IfYouNeedHelp: FunctionComponent = (): JSX.Element => (
  <Details summaryText="If you need help completing this form">
    <ul className="govuk-list">
      <li>
        <b>The UK Beacon Registry</b>
      </li>

      <li>
        <A href="mailto:ukbeacons@mcga.gov.uk">ukbeacons@mcga.gov.uk</A>
      </li>

      <li>Telephone: 01326 211569</li>
      <li>Fax: 01326 319264</li>
      <li>Monday to Friday, 9am to 5pm (except public holidays)</li>

      <li className="govuk-!-margin-top-5">
        <A href="https://www.gov.uk/call-charges">
          Find out about call charges
        </A>
      </li>

      <li className="govuk-!-margin-top-5">
        In an emergency in the UK, dial 999 and ask for the Coastguard. If you
        are at sea, use GMDSS systems to make a distress or urgency
        alert:Emergency Contact - Dial 999 and ask for the Coastguard
      </li>
    </ul>
  </Details>
);

export default CheckBeaconDetails;
