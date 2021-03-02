import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  DateInput,
  DateListInput,
  DateListItem,
  DateType,
} from "../../components/DateInput";
import { Details } from "../../components/Details";
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
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { FieldInput } from "../../lib/form/fieldInput";
import { FieldManager } from "../../lib/form/fieldManager";
import { CacheEntry } from "../../lib/formCache";
import { handlePageRequest } from "../../lib/handlePageRequest";

const getFormGroup = ({
  manufacturerSerialNumber,
  beaconCHKCode,
  beaconBatteryExpiryDateMonth,
  beaconBatteryExpiryDateYear,
  lastServicedDateMonth,
  lastServicedDateYear,
}: CacheEntry): FieldManager => {
  return new FieldManager({
    manufacturerSerialNumber: new FieldInput(manufacturerSerialNumber),
    beaconCHKCode: new FieldInput(beaconCHKCode),
    beaconBatteryExpiryDateMonth: new FieldInput(beaconBatteryExpiryDateMonth),
    beaconBatteryExpiryDateYear: new FieldInput(beaconBatteryExpiryDateYear),
    lastServicedDateMonth: new FieldInput(lastServicedDateMonth),
    lastServicedDateYear: new FieldInput(lastServicedDateYear),
  });
};

const BeaconInformationPage: FunctionComponent = (): JSX.Element => {
  const pageHeading = "Beacon information";

  // TODO: Use form validation to set this
  const pageHasErrors = false;

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/check-beacon-details" />}
      title={pageHeading}
      pageHasErrors={pageHasErrors}
    >
      <Grid
        mainContent={
          <>
            <Form action="/register-a-beacon/beacon-information">
              <FormFieldset>
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <InsetText>
                  Further information about your beacon is useful for Search and
                  Rescue. Provide as much information you can find.
                </InsetText>

                <BeaconManufacturerSerialNumberInput />

                <BeaconCHKCode />

                <BeaconBatteryExpiryDate />

                <BeaconLastServicedDate />
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

const BeaconManufacturerSerialNumberInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <Input
      id="beaconManufacturerSerialNumber"
      label="Enter beacon manufacturer serial number"
      htmlAttributes={{ spellCheck: false }}
    />
    <Details
      className="govuk-!-padding-top-2"
      summaryText="Where can I find the manufacturer serial number?"
    >
      TODO: Details text for where the user can find the manufacturer serial
      number.
    </Details>
  </FormGroup>
);

const BeaconCHKCode: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <Input
      id="beaconCHKCode"
      label="Enter the beacon CHK code (optional)"
      hintText="This might be on the registration card you received when you bought the
      beacon"
      htmlAttributes={{ spellCheck: false }}
    />
    <Details
      // TODO: Add govuk-!-!-padding-top-2 to component
      className="govuk-!-padding-top-2"
      summaryText="What is the beacon CHK code?"
    >
      If the beacon manufacturer uses a CHK code, it will be written on the
      manufacturers card underneath the Hex ID or UIN and serial number. An
      example is: CHK: 9480B
    </Details>
  </FormGroup>
);

const BeaconBatteryExpiryDate: FunctionComponent = (): JSX.Element => (
  <DateListInput id="beaconBatteryExpiryDate">
    <FormLabel
      htmlFor="beaconBatteryExpiryDate"
      className="govuk-date-input__label"
    >
      Enter your beacon battery expiry date (optional)
    </FormLabel>
    <FormHint forId="beaconBatteryExpiryDate">
      You only need to enter the month and year, for example 11 2009
    </FormHint>
    <DateListItem>
      <FormGroup>
        <FormLabel
          htmlFor="beaconBatteryExpiryDateMonth"
          className="govuk-date-input__label"
        >
          Month
        </FormLabel>
        <DateInput
          id="beaconBatteryExpiryDateMonth"
          name="beaconBatteryExpiryDateonth"
          dateType={DateType.MONTH}
        />
      </FormGroup>
    </DateListItem>

    <DateListItem>
      <FormGroup>
        <FormLabel
          htmlFor="beaconBatteryExpiryDateYear"
          className="govuk-date-input__label"
        >
          Year
        </FormLabel>
        <DateInput
          id="beaconBatteryExpiryDateYear"
          name="beaconBatteryExpiryDateYear"
          dateType={DateType.YEAR}
        />
      </FormGroup>
    </DateListItem>
  </DateListInput>
);

const BeaconLastServicedDate: FunctionComponent = (): JSX.Element => (
  <DateListInput id="beaconLastServicedDate">
    <FormLabel
      htmlFor="beaconLastServicedDate"
      className="govuk-date-input__label"
    >
      When was your beacon last serviced? (optional)
    </FormLabel>
    <FormHint forId="beaconLastServicedDate">
      You only need to enter the month and year, for example 11 2009
    </FormHint>
    <DateListItem>
      <FormGroup>
        <FormLabel
          htmlFor="beaconLastServicedDateMonth"
          className="govuk-date-input__label"
        >
          Month
        </FormLabel>
        <DateInput
          id="beaconLastServicedDateMonth"
          name="beaconLastServicedDateMonth"
          dateType={DateType.MONTH}
        />
      </FormGroup>
    </DateListItem>

    <DateListItem>
      <FormGroup>
        <FormLabel
          htmlFor="beaconLastServicedDateYear"
          className="govuk-date-input__label"
        >
          Year
        </FormLabel>
        <DateInput
          id="beaconLastServicedDateYear"
          name="beaconLastServicedDateYear"
          dateType={DateType.YEAR}
        />
      </FormGroup>
    </DateListItem>
  </DateListInput>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/primary-beacon-use",
  getFormGroup
);

export default BeaconInformationPage;
