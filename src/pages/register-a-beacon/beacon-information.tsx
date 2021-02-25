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
import { FormValidator } from "../../lib/formValidator";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { ensureFormDataHasKeys } from "../../lib/utils";

const BeaconInformationPage: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  formData = ensureFormDataHasKeys(
    formData,
    "manufacturerSerialNumber",
    "batteryExpiryDateMonth"
  );

  const errors = FormValidator.errorSummary(formData);

  const { manufacturerSerialNumber, model, hexId } = FormValidator.validate(
    formData
  );

  const pageHasErrors = needsValidation && FormValidator.hasErrors(formData);

  const pageHeading = "Beacon information";

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/check-beacon-details" />}
      title={pageHeading}
      pageHasErrors={pageHasErrors}
    >
      <Grid
        mainContent={
          <>
            <FormErrorSummary
              errors={errors}
              showErrorSummary={needsValidation}
            />
            <Form action="/register-a-beacon/beacon-information">
              <FormFieldset>
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <InsetText>
                  Further information about your beacon is useful for Search and
                  Rescue. Provide as much information you can find.
                </InsetText>

                <ManufacturerSerialNumberInput
                  value={formData.manufacturerSerialNumber}
                  showErrors={
                    needsValidation && manufacturerSerialNumber.invalid
                  }
                  errorMessages={manufacturerSerialNumber.errorMessages}
                />

                <CHKCode value={formData.chkCode} />

                <BatteryExpiryDate />

                <LastServicedDate />
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
  showErrors = false,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
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

const BatteryExpiryDate: FunctionComponent = (): JSX.Element => (
  <DateListInput
    id="batteryExpiryDate"
    label="Enter your beacon battery expiry date (optional)"
    hintText="You only need to enter the month and year, for example 11 2009"
  >
    <DateListItem
      id="batteryExpiryDateMonth"
      label="Month"
      dateType={DateType.MONTH}
    />

    <DateListItem
      id="batteryExpiryDateYear"
      label="Year"
      dateType={DateType.YEAR}
    />
  </DateListInput>
);

const LastServicedDate: FunctionComponent = (): JSX.Element => (
  <DateListInput
    id="lastServicedDate"
    label="When was your beacon last serviced? (optional)"
    hintText="You only need to enter the month and year, for example 11 2009"
  >
    <DateListItem
      id="lastServicedDateMonth"
      label="Month"
      dateType={DateType.MONTH}
    />

    <DateListItem
      id="lastServicedDateYear"
      label="Year"
      dateType={DateType.YEAR}
    />
  </DateListInput>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/primary-beacon-use"
);

export default BeaconInformationPage;
