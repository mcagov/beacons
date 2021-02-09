import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLabel,
  FormGroup,
  FormHint,
  FormLegendPageHeading,
} from "../../components/Form";
import { Details } from "../../components/Details";
import { IfYouNeedHelp } from "../../components/Mca";

const BeaconInformationPage: FunctionComponent = () => (
  <>
    <Layout navigation={<BackButton href="/intent" />}>
      <Grid
        mainContent={
          <>
            {/*TODO: Update link to next step in service flow*/}
            <Form action="/register-a-beacon/primary-use">
              <FormFieldset>
                <FormLegendPageHeading>
                  Beacon information
                </FormLegendPageHeading>
                <InsetText>
                  Further information about your beacon is useful for Search &
                  Rescue. Provide as much information you can find.
                </InsetText>

                <BeaconManufacturerSerialNumberInput />

                <BeaconCHKCode />

                <BeaconExpiryDate />

                <BeaconLastServicedDate />

                <IfYouNeedHelp />
              </FormFieldset>
              <Button buttonText="Continue" />
            </Form>
          </>
        }
      />
    </Layout>
  </>
);

const BeaconManufacturerSerialNumberInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="beaconManufacturerSerialNumber">
      Manufacturer serial number
    </FormLabel>
    <Input
      name="beaconManufacturerSerialNumber"
      id="beaconManufacturerSerialNumber"
      htmlAttributes={{ spellCheck: false, required: true }}
    />
    <Details
      className="govuk-!-padding-top-2"
      summaryText="Where can I find the manufacturer serial number?"
    >
      TODO: Details text for where the user can find the manufacturer serial
      number
    </Details>
  </FormGroup>
);

const BeaconCHKCode: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="beaconCHKCode">Beacon CHK code (optional)</FormLabel>
    <FormHint forId="beaconCHKCode">
      This might be on the registration card you received when you bought the
      beacon
    </FormHint>
    <Input
      name="beaconCHKCode"
      id="beaconCHKCode"
      htmlAttributes={{ spellCheck: false }}
    />
    <Details
      // TODO: Add govuk-!-!-padding-top-2 to component
      className="govuk-!-padding-top-2"
      summaryText="What is the beacon CHK code?"
    >
      TODO: What is the beacon CHK code?
    </Details>
  </FormGroup>
);

const BeaconExpiryDate: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="beaconBatteryExpiryDate">
      Enter your beacon battery expiry date (optional)
    </FormLabel>
    <FormHint forId="beaconBatteryExpiryDate">
      For example, you can enter this as dd/mm/yy or &quot;December 2021&quot;.
    </FormHint>
    <Input name="beaconBatteryExpiryDate" id="beaconBatteryExpiryDate" />
  </FormGroup>
);

const BeaconLastServicedDate: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="beaconLastServicedDate">
      When was your beacon last serviced?
    </FormLabel>
    <FormHint forId="beaconLastServicedDate">
      For example, you can enter this as dd/mm/yy or &quot;December 2021&quot;.
    </FormHint>
    <Input
      name="beaconLastServicedDate"
      id="beaconLastServicedDate"
      // TODO: Implement final date input format/UX once decided
      // See https://miro.com/app/board/o9J_lZuM9qs=/?openComment=3074457354280329719
      type="date"
      htmlAttributes={{ required: true }}
    />
  </FormGroup>
);

export default BeaconInformationPage;
