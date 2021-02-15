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
import { GetServerSideProps } from "next";
import { withCookieRedirect } from "../../lib/middleware";

const BeaconInformationPage: FunctionComponent = () => (
  <>
    <Layout
      navigation={<BackButton href="/register-a-beacon/check-beacon-details" />}
    >
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
              </FormFieldset>
              <Button buttonText="Continue" />
              <IfYouNeedHelp />
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
      Enter beacon manufacturer serial number
    </FormLabel>
    <Input
      name="beaconManufacturerSerialNumber"
      id="beaconManufacturerSerialNumber"
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
    <FormLabel htmlFor="beaconCHKCode">
      Enter the beacon CHK code (optional)
    </FormLabel>
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
      TODO: Details text explaining what a CHK code is and where the user can
      find it.
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
        ></DateInput>
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
        ></DateInput>
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
        ></DateInput>
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
        ></DateInput>
      </FormGroup>
    </DateListItem>
  </DateListInput>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async () => {
    return {
      props: {},
    };
  }
);

export default BeaconInformationPage;
