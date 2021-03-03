import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  DateListInput,
  DateListItem,
  DateType,
} from "../../components/DateInput";
import { Details } from "../../components/Details";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { FormInputProps, Input } from "../../components/Input";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

interface DateInputProps {
  monthValue: string;
  yearValue: string;
  errorMessages: string[];
}

const definePageForm = ({
  manufacturerSerialNumber,
  chkCode,
  batteryExpiryDateMonth,
  batteryExpiryDateYear,
  lastServicedDateMonth,
  lastServicedDateYear,
}: CacheEntry): FormManager => {
  return new FormManager({
    manufacturerSerialNumber: new FieldManager(manufacturerSerialNumber, [
      Validators.required("Beacon manufacturer is a required field"),
    ]),
    chkCode: new FieldManager(chkCode),
    batteryExpiryDateMonth: new FieldManager(batteryExpiryDateMonth, [
      Validators.wholeNumber("Battery expiry month must be a whole number"),
      Validators.min("Battery expiry month must be valid", 1),
      Validators.max("Battery expiry month must be valid", 12),
    ]),
    batteryExpiryDateYear: new FieldManager(batteryExpiryDateYear, [
      Validators.wholeNumber("Battery expiry year must be a whole number"),
    ]),
    lastServicedDateMonth: new FieldManager(lastServicedDateMonth, [
      Validators.wholeNumber("Last serviced date month must be a whole number"),
      Validators.min("Last serviced month must be valid", 1),
      Validators.max("Last serviced month must be valid", 12),
    ]),
    lastServicedDateYear: new FieldManager(lastServicedDateYear, [
      Validators.wholeNumber("Last serviced date year must be a whole number"),
    ]),
  });
};

const BeaconInformationPage: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Beacon information";

  const batteryExpiryDateErrorMessage = [
    ...form.fields.batteryExpiryDateMonth.errorMessages,
    ...form.fields.batteryExpiryDateYear.errorMessages,
  ];

  const lastServicedDateErrorMessages = [
    ...form.fields.lastServicedDateMonth.errorMessages,
    ...form.fields.lastServicedDateYear.errorMessages,
  ];

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/check-beacon-details" />}
      title={pageHeading}
      pageHasErrors={form.hasErrors}
    >
      <Grid
        mainContent={
          <>
            <FormErrorSummary formErrors={form.errorSummary} />
            <Form action="/register-a-beacon/beacon-information">
              <FormFieldset>
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <InsetText>
                  Further information about your beacon is useful for Search and
                  Rescue. Provide as much information you can find.
                </InsetText>

                <ManufacturerSerialNumberInput
                  value={form.fields.manufacturerSerialNumber.value}
                  errorMessages={
                    form.fields.manufacturerSerialNumber.errorMessages
                  }
                />

                <CHKCode value={form.fields.chkCode.value} />

                <BatteryExpiryDate
                  monthValue={form.fields.batteryExpiryDateMonth.value}
                  yearValue={form.fields.batteryExpiryDateYear.value}
                  errorMessages={batteryExpiryDateErrorMessage}
                />

                <LastServicedDate
                  monthValue={form.fields.lastServicedDateMonth.value}
                  yearValue={form.fields.lastServicedDateYear.value}
                  errorMessages={lastServicedDateErrorMessages}
                />
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

const ManufacturerSerialNumberInput: FunctionComponent<FormInputProps> = ({
  value,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="manufacturerSerialNumber"
      label="Enter beacon manufacturer serial number"
      htmlAttributes={{ spellCheck: false }}
      defaultValue={value}
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

const CHKCode: FunctionComponent<FormInputProps> = ({
  value,
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="chkCode"
      label="Enter the beacon CHK code (optional)"
      hintText="This might be on the registration card you received when you bought the
      beacon"
      defaultValue={value}
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

const BatteryExpiryDate: FunctionComponent<DateInputProps> = ({
  monthValue,
  yearValue,
  errorMessages,
}: DateInputProps): JSX.Element => (
  <DateListInput
    id="batteryExpiryDate"
    label="Enter your beacon battery expiry date (optional)"
    hintText="You only need to enter the month and year, for example 11 2009"
    errorMessages={errorMessages}
  >
    <DateListItem
      id="batteryExpiryDateMonth"
      label="Month"
      defaultValue={monthValue}
      dateType={DateType.MONTH}
    />

    <DateListItem
      id="batteryExpiryDateYear"
      label="Year"
      defaultValue={yearValue}
      dateType={DateType.YEAR}
    />
  </DateListInput>
);

const LastServicedDate: FunctionComponent<DateInputProps> = ({
  monthValue,
  yearValue,
  errorMessages,
}: DateInputProps): JSX.Element => (
  <DateListInput
    id="lastServicedDate"
    label="When was your beacon last serviced? (optional)"
    hintText="You only need to enter the month and year, for example 11 2009"
    errorMessages={errorMessages}
  >
    <DateListItem
      id="lastServicedDateMonth"
      label="Month"
      defaultValue={monthValue}
      dateType={DateType.MONTH}
    />

    <DateListItem
      id="lastServicedDateYear"
      label="Year"
      defaultValue={yearValue}
      dateType={DateType.YEAR}
    />
  </DateListInput>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/primary-beacon-use",
  definePageForm
);

export default BeaconInformationPage;
