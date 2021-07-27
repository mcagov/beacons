import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { CheckboxList, CheckboxListItem } from "../../components/Checkbox";
import { FormFieldset, FormGroup, FormLegend } from "../../components/Form";
import { Input } from "../../components/Input";
import { TextareaCharacterCount } from "../../components/Textarea";
import { GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormPageProps } from "../../lib/handlePageRequest";
import { withCookiePolicy } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { PageURLs } from "../../lib/urls";
import { BeaconUseFormMapper } from "../../presenters/BeaconUseFormMapper";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { makeRegistrationMapper } from "../../presenters/UseMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfNoUseIndex } from "../../router/rules/IfNoUseIndex";
import { IfUserSubmittedInvalidRegistrationForm } from "../../router/rules/IfUserSubmittedInvalidRegistrationForm";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";
import { IfUserViewedRegistrationForm } from "../../router/rules/IfUserViewedRegistrationForm";

interface AircraftCommunicationsForm {
  vhfRadio: string;
  satelliteTelephone: string;
  satelliteTelephoneInput: string;
  mobileTelephone: string;
  mobileTelephoneInput1: string;
  mobileTelephoneInput2: string;
  otherCommunication: string;
  otherCommunicationInput: string;
}

const AircraftCommunications: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "How can we communicate with you, when on this aircraft?";
  const pageText = (
    <GovUKBody>
      {"This will be critical for Search and Rescue in an emergency."}
    </GovUKBody>
  );

  return (
    <BeaconsForm
      previousPageUrl="/register-a-beacon/about-the-aircraft"
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      pageText={pageText}
    >
      <TypesOfCommunication form={form} />
    </BeaconsForm>
  );
};

const TypesOfCommunication: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps) => (
  <FormFieldset>
    <FormLegend size="small">
      Tick all that apply and provide as much detail as you can
    </FormLegend>

    <FormGroup>
      <CheckboxList conditional={true}>
        <CheckboxListItem
          id="vhfRadio"
          defaultChecked={form.fields.vhfRadio.value.includes("true")}
          label="VHF Radio"
        />
        <CheckboxListItem
          id="satelliteTelephone"
          defaultChecked={form.fields.satelliteTelephone.value.includes("true")}
          label="Satellite Telephone"
          conditional={true}
        >
          <FormGroup
            errorMessages={form.fields.satelliteTelephoneInput.errorMessages}
          >
            <Input
              id="satelliteTelephoneInput"
              label="Enter phone number"
              hintText="Iridium start: +8816, Inmarsat (ISAT, FLEET, BGAN) start +870, Thuraya start: +8821, Globalstar start: +3364"
              defaultValue={form.fields.satelliteTelephoneInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="mobileTelephone"
          defaultChecked={form.fields.mobileTelephone.value.includes("true")}
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
          defaultChecked={form.fields.otherCommunication.value.includes("true")}
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
  </FormFieldset>
);

export const getServerSideProps: GetServerSideProps = withCookiePolicy(
  withContainer(
    withSession(async (context: BeaconsGetServerSidePropsContext) => {
      const nextPage = PageURLs.moreDetails;

      return await new BeaconsPageRouter([
        new IfNoUseIndex(context),
        new IfUserViewedRegistrationForm<AircraftCommunicationsForm>(
          context,
          validationRules,
          mapper(context)
        ),
        new IfUserSubmittedInvalidRegistrationForm<AircraftCommunicationsForm>(
          context,
          validationRules,
          mapper(context)
        ),
        new IfUserSubmittedValidRegistrationForm<AircraftCommunicationsForm>(
          context,
          validationRules,
          mapper(context),
          nextPage
        ),
      ]).execute();
    })
  )
);

const mapper = (
  context: BeaconsGetServerSidePropsContext
): RegistrationFormMapper<AircraftCommunicationsForm> => {
  const beaconUseMapper: BeaconUseFormMapper<AircraftCommunicationsForm> = {
    toDraftBeaconUse: (form) => ({
      vhfRadio: form.vhfRadio,
      satelliteTelephone: form.satelliteTelephone,
      satelliteTelephoneInput: form.satelliteTelephoneInput,
      mobileTelephone: form.mobileTelephone,
      mobileTelephoneInput1: form.mobileTelephoneInput1,
      mobileTelephoneInput2: form.mobileTelephoneInput2,
      otherCommunication: form.otherCommunication,
      otherCommunicationInput: form.otherCommunicationInput,
    }),
    toForm: (draftRegistration) => ({
      vhfRadio: draftRegistration.vhfRadio,
      satelliteTelephone: draftRegistration.satelliteTelephone,
      satelliteTelephoneInput: draftRegistration.satelliteTelephoneInput,
      mobileTelephone: draftRegistration.mobileTelephone,
      mobileTelephoneInput1: draftRegistration.mobileTelephoneInput1,
      mobileTelephoneInput2: draftRegistration.mobileTelephoneInput2,
      otherCommunication: draftRegistration.otherCommunication,
      otherCommunicationInput: draftRegistration.otherCommunicationInput,
    }),
  };

  const useIndex = parseInt(context.query.useIndex as string);

  return makeRegistrationMapper<AircraftCommunicationsForm>(
    useIndex,
    beaconUseMapper
  );
};

const validationRules = ({
  vhfRadio,
  satelliteTelephone,
  satelliteTelephoneInput,
  mobileTelephone,
  mobileTelephoneInput1,
  mobileTelephoneInput2,
  otherCommunication,
  otherCommunicationInput,
}: AircraftCommunicationsForm): FormManager => {
  const matchingConditionIsTrueForKey = (key: string) => ({
    dependsOn: key,
    meetingCondition: (value) => value.includes("true"),
  });

  return new FormManager({
    vhfRadio: new FieldManager(vhfRadio),
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

export default AircraftCommunications;
