import { GetServerSideProps } from "next";
import Image from "next/legacy/image";
import React, { FunctionComponent } from "react";
import { BeaconsForm, BeaconsFormHeading } from "../../components/BeaconsForm";
import { DateListItem, DateType } from "../../components/DateInput";
import { Details } from "../../components/Details";
import {
  FormFieldset,
  FormGroup,
  FormHint,
  FormLegend,
} from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { GovUKBody } from "../../components/Typography";
import { toIsoDateString } from "../../lib/dateTime";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { DraftRegistrationPageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { CreateRegistrationPageURLs } from "../../lib/urls";
import { padNumberWithLeadingZeros } from "../../lib/writingStyle";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { FormSubmission } from "../../presenters/formSubmission";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface BeaconInformationForm {
  manufacturerSerialNumber: string;
  chkCode: string;
  csta: string;
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
  previousPageUrl,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Beacon information";
  const pageText = (
    <GovUKBody>
      {
        "Further information about your beacon is useful for Search and Rescue. Provide as much information as you can."
      }
    </GovUKBody>
  );

  return (
    <BeaconsForm
      previousPageUrl={previousPageUrl}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />
      {pageText}
      <ManufacturerSerialNumberInput
        value={form.fields.manufacturerSerialNumber.value}
        errorMessages={form.fields.manufacturerSerialNumber.errorMessages}
      />
      <CHKCode value={form.fields.chkCode.value} />
      <CSTACode value={form.fields.csta.value} />
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
        alt="This image illustrates what a beacon's manufacturer serial number looks like
        on an actual beacon (i.e. SerNo: 0141201577T)."
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
      label="Enter the beacon CHK (checksum) code (optional)"
      hintText="This might be on the registration card you received when you bought the
      beacon"
      defaultValue={value}
      htmlAttributes={{ spellCheck: false }}
    />
    <Details
      // TODO: Add govuk-!-!-padding-top-2 to component
      className="govuk-!-padding-top-2"
      summaryText="What is the beacon CHK (checksum) code?"
    >
      The beacon CHK is a checksum or code which verifies the hexadecimal beacon
      ID. An example is: CHK: 9480B. If the beacon manufacturer uses a CHK code,
      it will be written on the manufacturers card underneath the Hex ID or UIN
      and serial number.
    </Details>
  </FormGroup>
);

const CSTACode: FunctionComponent<FormInputProps> = ({
  value,
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="csta"
      label="Enter the CSTA / TAC code (optional)"
      hintText="This might be on the registration card you received when you bought the
      beacon"
      defaultValue={value}
      htmlAttributes={{ spellCheck: false }}
    />
    <Details
      // TODO: Add govuk-!-!-padding-top-2 to component
      className="govuk-!-padding-top-2"
      summaryText="What is the beacon CSTA / TAC code?"
    >
      The beacon CSTA or TAC code which some beacons comes with. An example is:
      CSTA / TAC: 1024.
    </Details>
  </FormGroup>
);

const BatteryExpiryDate: FunctionComponent<DateInputProps> = ({
  monthValue,
  yearValue,
  errorMessages,
}: DateInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <FormFieldset ariaDescribedBy="batteryExpiryDate-hint">
      <FormLegend>Enter your beacon battery expiry date (optional)</FormLegend>
      <FormHint forId="batteryExpiryDate">
        You only need to enter the month and year, for example 11 2009
      </FormHint>
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
    </FormFieldset>
  </FormGroup>
);

const LastServicedDate: FunctionComponent<DateInputProps> = ({
  monthValue,
  yearValue,
  errorMessages,
}: DateInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <FormFieldset ariaDescribedBy="lastServicedDate-hint">
      <FormLegend>When was your beacon last serviced? (optional)</FormLegend>
      <FormHint forId="lastServicedDate">
        You only need to enter the month and year, for example 11 2009
      </FormHint>
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
    </FormFieldset>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPageUrl = CreateRegistrationPageURLs.environment;

    const previousPageUrl =
      context.query.previous || CreateRegistrationPageURLs.checkBeaconDetails;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage(
        context,
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm(
        context,
        validationRules,
        mapper,
        { previousPageUrl },
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors(
        context,
        validationRules,
        mapper,
        { previousPageUrl },
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage(
        context,
        validationRules,
        mapper,
        nextPageUrl,
      ),
    ]).execute();
  }),
);

const mapper: DraftRegistrationFormMapper<BeaconInformationForm> = {
  formToDraftRegistration: (form) => ({
    manufacturerSerialNumber: form.manufacturerSerialNumber,
    chkCode: form.chkCode,
    csta: form.csta,
    batteryExpiryDate: toIsoDateString(
      form.batteryExpiryDateYear,
      form.batteryExpiryDateMonth,
    ),
    batteryExpiryDateYear: form.batteryExpiryDateYear,
    batteryExpiryDateMonth: form.batteryExpiryDateMonth,
    lastServicedDate: toIsoDateString(
      form.lastServicedDateYear,
      form.lastServicedDateMonth,
    ),
    lastServicedDateYear: form.lastServicedDateYear,
    lastServicedDateMonth: form.lastServicedDateMonth,
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => ({
    manufacturerSerialNumber: draftRegistration?.manufacturerSerialNumber,
    chkCode: draftRegistration?.chkCode,
    csta: draftRegistration?.csta,
    batteryExpiryDate: draftRegistration?.batteryExpiryDate,
    batteryExpiryDateMonth: padNumberWithLeadingZeros(
      draftRegistration?.batteryExpiryDateMonth,
    ),
    batteryExpiryDateYear: padNumberWithLeadingZeros(
      draftRegistration?.batteryExpiryDateYear,
      4,
    ),
    lastServicedDate: draftRegistration?.lastServicedDate,
    lastServicedDateMonth: padNumberWithLeadingZeros(
      draftRegistration?.lastServicedDateMonth,
    ),
    lastServicedDateYear: padNumberWithLeadingZeros(
      draftRegistration?.lastServicedDateYear,
      4,
    ),
  }),
};

const validationRules = ({
  manufacturerSerialNumber,
  chkCode,
  csta,
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
        "Beacon manufacturer serial number is a required field",
      ),
    ]),
    chkCode: new FieldManager(chkCode),
    csta: new FieldManager(csta),
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
      ],
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
      ],
    ),
    lastServicedDateMonth: new FieldManager(lastServicedDateMonth),
    lastServicedDateYear: new FieldManager(lastServicedDateYear),
  });
};

export default BeaconInformationPage;
