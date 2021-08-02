import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import {
  DateListInput,
  DateListItem,
  DateType,
} from "../../components/DateInput";
import { Details } from "../../components/Details";
import { FormGroup } from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { GovUKBody } from "../../components/Typography";
import { toIsoDateString } from "../../lib/dateTime";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { FormSubmission } from "../../lib/formCache";
import { DraftRegistrationPageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { PageURLs } from "../../lib/urls";
import { padNumberWithLeadingZeros } from "../../lib/writingStyle";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserSubmittedInvalidRegistrationForm } from "../../router/rules/IfUserSubmittedInvalidRegistrationForm";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";
import { IfUserViewedRegistrationForm } from "../../router/rules/IfUserViewedRegistrationForm";

interface BeaconInformationForm {
  manufacturerSerialNumber: string;
  chkCode: string;
  batteryExpiryDate: string;
  batteryExpiryDateMonth: string;
  batteryExpiryDateYear: string;
  lastServicedDate: string;
  lastServicedDateMonth: string;
  lastServicedDateYear: string;
}

const BeaconInformationPage: FunctionComponent<DraftRegistrationPageProps> = ({
  form,
  showCookieBanner,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Beacon information";
  const pageText = (
    <GovUKBody>
      {
        "Further information about your beacon is useful for Search and Rescue. Provide as much information you can find."
      }
    </GovUKBody>
  );

  return (
    <BeaconsForm
      previousPageUrl={PageURLs.checkBeaconDetails}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      pageText={pageText}
    >
      <ManufacturerSerialNumberInput
        value={form.fields.manufacturerSerialNumber.value}
        errorMessages={form.fields.manufacturerSerialNumber.errorMessages}
      />
      <CHKCode value={form.fields.chkCode.value} />
      <BatteryExpiryDate
        monthValue={form.fields.batteryExpiryDateMonth.value}
        yearValue={form.fields.batteryExpiryDateYear.value}
        errorMessages={form.fields.batteryExpiryDate.errorMessages}
      />
      <LastServicedDate
        monthValue={form.fields.lastServicedDateMonth.value}
        yearValue={form.fields.lastServicedDateYear.value}
        errorMessages={form.fields.lastServicedDate.errorMessages}
      />
    </BeaconsForm>
  );
};

interface DateInputProps {
  monthValue: string;
  yearValue: string;
  errorMessages: string[];
}

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
      <Image
        src="/assets/mca_images/beacon_serial_number.png"
        alt="Where to find your beacon's manufacturer serial number"
        height={640}
        width={960}
      />
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

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPageUrl = PageURLs.environment;

    return await new BeaconsPageRouter([
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new IfUserViewedRegistrationForm(context, validationRules, mapper),
      new IfUserSubmittedInvalidRegistrationForm(
        context,
        validationRules,
        mapper
      ),
      new IfUserSubmittedValidRegistrationForm(
        context,
        validationRules,
        mapper,
        nextPageUrl
      ),
    ]).execute();
  })
);

const mapper: DraftRegistrationFormMapper<BeaconInformationForm> = {
  formToDraftRegistration: (form) => ({
    manufacturerSerialNumber: form.manufacturerSerialNumber,
    chkCode: form.chkCode,
    batteryExpiryDate: toIsoDateString(
      form.batteryExpiryDateYear,
      form.batteryExpiryDateMonth
    ),
    batteryExpiryDateYear: form.batteryExpiryDateYear,
    batteryExpiryDateMonth: form.batteryExpiryDateMonth,
    lastServicedDate: toIsoDateString(
      form.lastServicedDateYear,
      form.lastServicedDateMonth
    ),
    lastServicedDateYear: form.lastServicedDateYear,
    lastServicedDateMonth: form.lastServicedDateMonth,
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => ({
    manufacturerSerialNumber: draftRegistration?.manufacturerSerialNumber,
    chkCode: draftRegistration?.chkCode,
    batteryExpiryDate: draftRegistration?.batteryExpiryDate,
    batteryExpiryDateMonth: padNumberWithLeadingZeros(
      draftRegistration?.batteryExpiryDateMonth
    ),
    batteryExpiryDateYear: padNumberWithLeadingZeros(
      draftRegistration?.batteryExpiryDateYear,
      4
    ),
    lastServicedDate: draftRegistration?.lastServicedDate,
    lastServicedDateMonth: padNumberWithLeadingZeros(
      draftRegistration?.lastServicedDateMonth
    ),
    lastServicedDateYear: padNumberWithLeadingZeros(
      draftRegistration?.lastServicedDateYear,
      4
    ),
  }),
};

const validationRules = ({
  manufacturerSerialNumber,
  chkCode,
  batteryExpiryDate,
  batteryExpiryDateMonth,
  batteryExpiryDateYear,
  lastServicedDate,
  lastServicedDateMonth,
  lastServicedDateYear,
}: FormSubmission): FormManager => {
  return new FormManager({
    manufacturerSerialNumber: new FieldManager(manufacturerSerialNumber, [
      Validators.required(
        "Beacon manufacturer serial number is a required field"
      ),
    ]),
    chkCode: new FieldManager(chkCode),
    batteryExpiryDate: new FieldManager(
      batteryExpiryDate,
      [
        Validators.isValidDate("Enter a correct battery expiry date"),
        Validators.minDateYear("Battery expiry date must be after 1980", 1980),
      ],
      [
        {
          dependsOn: "batteryExpiryDate",
          meetingCondition: () =>
            batteryExpiryDateYear !== "" || batteryExpiryDateMonth !== "",
        },
      ]
    ),
    batteryExpiryDateMonth: new FieldManager(batteryExpiryDateMonth),
    batteryExpiryDateYear: new FieldManager(batteryExpiryDateYear),
    lastServicedDate: new FieldManager(
      lastServicedDate,
      [
        Validators.isValidDate("Enter a correct last serviced date"),
        Validators.isInThePast("Enter a last serviced date in the past"),
        Validators.minDateYear("Last serviced date must be after 1980", 1980),
      ],
      [
        {
          dependsOn: "lastServicedDate",
          meetingCondition: () =>
            lastServicedDateYear !== "" || lastServicedDateMonth !== "",
        },
      ]
    ),
    lastServicedDateMonth: new FieldManager(lastServicedDateMonth),
    lastServicedDateYear: new FieldManager(lastServicedDateYear),
  });
};

export default BeaconInformationPage;
