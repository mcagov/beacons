import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../../../../../components/BeaconsForm";
import {
  CheckboxList,
  CheckboxListItem,
} from "../../../../../../components/Checkbox";
import { FormGroup, FormHint } from "../../../../../../components/Form";
import { Input } from "../../../../../../components/Input";
import { TextareaCharacterCount } from "../../../../../../components/Textarea";
import { GovUKBody } from "../../../../../../components/Typography";
import { FieldManager } from "../../../../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../../../../lib/form/FormManager";
import { Validators } from "../../../../../../lib/form/Validators";
import { DraftBeaconUsePageProps } from "../../../../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../../../lib/middleware/withContainer";
import { withSession } from "../../../../../../lib/middleware/withSession";
import { Actions } from "../../../../../../lib/URLs/Actions";
import { UrlBuilder } from "../../../../../../lib/URLs/UrlBuilder";
import { UsePages } from "../../../../../../lib/URLs/UsePages";
import { BeaconUseFormMapper } from "../../../../../../presenters/BeaconUseFormMapper";
import { DraftRegistrationFormMapper } from "../../../../../../presenters/DraftRegistrationFormMapper";
import { makeDraftRegistrationMapper } from "../../../../../../presenters/makeDraftRegistrationMapper";
import { BeaconsPageRouter } from "../../../../../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

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

const AircraftCommunications: FunctionComponent<DraftBeaconUsePageProps> = ({
  form,
  draftRegistration,
  showCookieBanner,
  useId,
}: DraftBeaconUsePageProps): JSX.Element => {
  const pageHeading =
    "How can we communicate with you, when on this aircraft? (Optional)";
  const pageText = (
    <GovUKBody>
      {"This will be critical for Search and Rescue in an emergency."}
    </GovUKBody>
  );

  return (
    <BeaconsForm
      previousPageUrl={UrlBuilder.buildUseUrl(
        Actions.update,
        UsePages.aboutTheAircraft,
        draftRegistration.id,
        useId
      )}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
    >
      <BeaconsFormFieldsetAndLegend
        pageHeading={pageHeading}
        ariaDescribedBy="aircraft-communication-types-hint"
      >
        {pageText}
        <TypesOfCommunication form={form} />
      </BeaconsFormFieldsetAndLegend>
    </BeaconsForm>
  );
};

const TypesOfCommunication: FunctionComponent<{ form: FormJSON }> = ({
  form,
}: {
  form: FormJSON;
}) => (
  <>
    <FormHint forId="aircraft-communication-types">
      Tick all that apply and provide as much detail as you can
    </FormHint>

    <FormGroup>
      <CheckboxList conditional={true}>
        <CheckboxListItem
          id="vhfRadio"
          defaultChecked={form.fields.vhfRadio.value === "true"}
          label="VHF Radio"
        />
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
              hintText="Iridium start: +8816, Inmarsat (ISAT, FLEET, BGAN) start +870, Thuraya start: +8821, Globalstar start: +3364"
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
  </>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const { registrationId, useId } = context.query;

    const nextPage = UrlBuilder.buildUseUrl(
      Actions.update,
      UsePages.moreDetails,
      registrationId as string,
      useId as string
    );

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<AircraftCommunicationsForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<AircraftCommunicationsForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage<AircraftCommunicationsForm>(
        context,
        validationRules,
        mapper(context),
        nextPage
      ),
    ]).execute();
  })
);

const props = (
  context: BeaconsGetServerSidePropsContext
): Partial<DraftBeaconUsePageProps> => ({
  useId: context.query.useId as string,
});

const mapper = (
  context: BeaconsGetServerSidePropsContext
): DraftRegistrationFormMapper<AircraftCommunicationsForm> => {
  const beaconUseMapper: BeaconUseFormMapper<AircraftCommunicationsForm> = {
    formToDraftBeaconUse: (form) => ({
      vhfRadio: form.vhfRadio || "false",
      satelliteTelephone: form.satelliteTelephone || "false",
      satelliteTelephoneInput: form.satelliteTelephoneInput,
      mobileTelephone: form.mobileTelephone || "false",
      mobileTelephoneInput1: form.mobileTelephoneInput1,
      mobileTelephoneInput2: form.mobileTelephoneInput2,
      otherCommunication: form.otherCommunication || "false",
      otherCommunicationInput: form.otherCommunicationInput,
    }),
    beaconUseToForm: (draftRegistration) => ({
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

  const useIndex = parseInt(context.query.useId as string);

  return makeDraftRegistrationMapper<AircraftCommunicationsForm>(
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
    meetingCondition: (value) => value === "true",
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
