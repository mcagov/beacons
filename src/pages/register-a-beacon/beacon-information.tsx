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
import {
  DateInput,
  DateListInput,
  DateListItem,
  DateType,
} from "../../components/DateInput";

const BeaconInformationPage: FunctionComponent = () => (
  <>
    <Layout navigation={<BackButton href="/intent" />}>
      <Grid
        mainContent={
          <>
            {/*TODO: Update link to next step in service flow*/}
            <Form action="/register-a-beacon/beacon-information">
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

                <BeaconBatteryExpiryDate />

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

const BeaconBatteryExpiryDate: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel
      htmlFor="beaconBatteryExpiryDate"
      className="govuk-date-input__label"
    >
      Enter your beacon battery expiry date (optional)
    </FormLabel>
    <FormHint forId="beaconBatteryExpiryDate">
      You only need to enter the month and year, for example 11 2009
    </FormHint>
    <Input name="beaconBatteryExpiryDate" id="beaconBatteryExpiryDate" />
  </FormGroup>
);

const BeaconLastServicedDate: FunctionComponent = (): JSX.Element => (
  <DateListInput id="beaconLastServicedDate">
    <DateListItem>
      <FormGroup>
        <FormLabel htmlFor="beaconLastServicedDateMonth">Month</FormLabel>
        <DateInput
          id="beaconLastServicedDateMonth"
          name="beaconLastServicedDateMonth"
          dateType={DateType.MONTH}
        >
          Month
        </DateInput>
      </FormGroup>
    </DateListItem>
    <FormLabel
      htmlFor="beaconLastServicedDate"
      className="govuk-date-input__label"
    >
      When was your beacon last serviced? (optional)
    </FormLabel>
    <FormHint forId="beaconLastServicedDate">
      You only need to enter the month and year, for example 11 2009
    </FormHint>
    <Input
      name="beaconLastServicedDate"
      id="beaconLastServicedDate"
      // TODO: Implement final date input format/UX once decided
      // See https://miro.com/app/board/o9J_lZuM9qs=/?openComment=3074457354280329719
      type="date"
      htmlAttributes={{ required: true }}
    />
  </DateListInput>
);

export default BeaconInformationPage;
