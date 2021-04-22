import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { CheckboxList, CheckboxListItem } from "../../components/Checkbox";
import { FormGroup, FormLegend } from "../../components/Form";
import { Input } from "../../components/Input";
import { TextareaCharacterCount } from "../../components/Textarea";
import { AnchorLink, GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { ofcomLicenseUrl, PageURLs } from "../../lib/urls";

const matchingConditionIsTrueForKey = (key: string) => ({
  dependsOn: key,
  meetingCondition: (value) => value === "true",
});

const definePageForm = ({
  portableVhfRadio,
  portableVhfRadioInput,
  satelliteTelephone,
  satelliteTelephoneInput,
  mobileTelephone,
  mobileTelephoneInput1,
  mobileTelephoneInput2,
  otherCommunication,
  otherCommunicationInput,
}: FormSubmission): FormManager => {
  return new FormManager({
    portableVhfRadio: new FieldManager(portableVhfRadio),
    portableVhfRadioInput: new FieldManager(
      portableVhfRadioInput,
      [
        Validators.required(
          "We need your portable MMSI number if you have a portable VHF/DSC radio"
        ),
        Validators.mmsiNumber(
          "Your portable MMSI number must be exactly nine digits long and only include numbers 0 to 9, with no letters or other characters"
        ),
      ],
      [matchingConditionIsTrueForKey("portableVhfRadio")]
    ),
    satelliteTelephone: new FieldManager(satelliteTelephone),
    satelliteTelephoneInput: new FieldManager(
      satelliteTelephoneInput,
      [
        Validators.required(
          "We need your phone number if you have a satellite telephone"
        ),
        Validators.phoneNumber(
          "Enter a satellite telephone number in the correct format"
        ),
      ],
      [matchingConditionIsTrueForKey("satelliteTelephone")]
    ),
    mobileTelephone: new FieldManager(mobileTelephone),
    mobileTelephoneInput1: new FieldManager(
      mobileTelephoneInput1,
      [
        Validators.required(
          "We need your telephone number if you have a mobile telephone"
        ),
        Validators.phoneNumber(
          "Enter a mobile telephone number, like 07700 982736 or +447700912738"
        ),
      ],
      [matchingConditionIsTrueForKey("mobileTelephone")]
    ),
    mobileTelephoneInput2: new FieldManager(mobileTelephoneInput2),
    otherCommunication: new FieldManager(otherCommunication),
    otherCommunicationInput: new FieldManager(
      otherCommunicationInput,
      [
        Validators.required("We need your other communication"),
        Validators.maxLength(
          "Other communication has too many characters",
          250
        ),
      ],
      [matchingConditionIsTrueForKey("otherCommunication")]
    ),
  });
};

const LandCommunications: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "How can we communicate with you?";

  const pageText = (
    <>
      <GovUKBody>
        This will be critical for Search and Rescue in an emergency.
      </GovUKBody>
      <GovUKBody>
        If you have a radio license, VHF and/or VHF/DSC radio, you can{" "}
        <AnchorLink href={ofcomLicenseUrl}>
          find up your Call Sign and Maritime Mobile Service Identity (MMSI)
          number on the OFCOM website.
        </AnchorLink>
      </GovUKBody>
      <FormLegend size="small">
        Tick all that apply and provide as much detail as you can
      </FormLegend>
    </>
  );

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      previousPageUrl={PageURLs.activity}
      formErrors={form.errorSummary}
      showCookieBanner={showCookieBanner}
      pageText={pageText}
    >
      <TypesOfCommunication form={form} />
    </BeaconsForm>
  );
};

const TypesOfCommunication: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps) => (
  <FormGroup>
    <CheckboxList conditional={true}>
      <CheckboxListItem
        id="portableVhfRadio"
        defaultChecked={form.fields.portableVhfRadio.value === "true"}
        label="Portable VHF/DSC Radio"
        conditional={true}
      >
        <FormGroup
          errorMessages={form.fields.portableVhfRadioInput.errorMessages}
        >
          <Input
            id="portableVhfRadioInput"
            label="Portable MMSI number"
            hintText="This is the unique MMSI number associated to the portable radio and is 9 numbers long. E.g. starts with 2359xxxxx"
            defaultValue={form.fields.portableVhfRadioInput.value}
          />
        </FormGroup>
      </CheckboxListItem>
      <CheckboxListItem
        id="satelliteTelephone"
        defaultChecked={form.fields.satelliteTelephone.value === "true"}
        label="Satellite Telephone"
        conditional={true}
      >
        <FormGroup
          errorMessages={form.fields.satelliteTelephoneInput.errorMessages}
        >
          <Input
            id="satelliteTelephoneInput"
            label="Enter phone number"
            hintText="Iridium usually start: +8707, Thuraya usually start: +8821, Globalstar usually start: +3364)"
            defaultValue={form.fields.satelliteTelephoneInput.value}
          />
        </FormGroup>
      </CheckboxListItem>
      <CheckboxListItem
        id="mobileTelephone"
        defaultChecked={form.fields.mobileTelephone.value === "true"}
        label="Mobile Telephone(s)"
        conditional={true}
      >
        <FormGroup
          errorMessages={form.fields.mobileTelephoneInput1.errorMessages}
        >
          <Input
            id="mobileTelephoneInput1"
            label="Mobile number 1"
            inputClassName="govuk-!-margin-bottom-4"
            defaultValue={form.fields.mobileTelephoneInput1.value}
            htmlAttributes={{ autoComplete: "tel" }}
          />
        </FormGroup>

        <Input
          id="mobileTelephoneInput2"
          label="Mobile number 2 (optional)"
          defaultValue={form.fields.mobileTelephoneInput2.value}
          htmlAttributes={{ autoComplete: "tel" }}
        />
      </CheckboxListItem>
      <CheckboxListItem
        id="otherCommunication"
        defaultChecked={form.fields.otherCommunication.value === "true"}
        label="Other"
        conditional={true}
      >
        <FormGroup
          errorMessages={form.fields.otherCommunicationInput.errorMessages}
        >
          <TextareaCharacterCount
            id="otherCommunicationInput"
            label="Please provide details of how we can contact you"
            defaultValue={form.fields.otherCommunicationInput.value}
            maxCharacters={250}
          />
        </FormGroup>
      </CheckboxListItem>
    </CheckboxList>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/more-details",
  definePageForm
);

export default LandCommunications;
