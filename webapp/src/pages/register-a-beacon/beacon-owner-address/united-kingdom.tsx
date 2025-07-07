import { GetServerSideProps } from "next";
import React, { FunctionComponent, type JSX } from "react";
import { BackButton, Button } from "../../../components/Button";
import { FormErrorSummary } from "../../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../../components/Form";
import { Grid } from "../../../components/Grid";
import { FormInputProps, Input } from "../../../components/Input";
import { Layout } from "../../../components/Layout";
import { IfYouNeedHelp } from "../../../components/Mca";
import { GovUKBody } from "../../../components/Typography";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormManager } from "../../../lib/form/FormManager";
import { Validators } from "../../../lib/form/Validators";
import { DraftRegistrationPageProps } from "../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { CreateRegistrationPageURLs } from "../../../lib/urls";
import { DraftRegistrationFormMapper } from "../../../presenters/DraftRegistrationFormMapper";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage } from "../../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface BeaconOwnerAddressForm {
  ownerAddressLine1: string;
  ownerAddressLine2: string;
  ownerTownOrCity: string;
  ownerCounty: string;
  ownerPostcode: string;
}

const BeaconOwnerAddressUnitedKingdom: FunctionComponent<
  DraftRegistrationPageProps
> = ({ form, showCookieBanner }: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "What is the beacon owner's address?";

  return (
    <Layout
      navigation={
        <BackButton href={CreateRegistrationPageURLs.beaconOwnerAddress} />
      }
      title={pageHeading}
      pageHasErrors={form.hasErrors}
      showCookieBanner={showCookieBanner}
    >
      <Grid
        mainContent={
          <>
            <Form>
              <FormFieldset>
                <FormErrorSummary formErrors={form.errorSummary} />
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <GovUKBody>
                  The beacon registration certificate and proof of registration
                  labels to stick to the beacon will be sent to this address
                </GovUKBody>
                <BuildingNumberAndStreetInput
                  valueLine1={form.fields.ownerAddressLine1.value}
                  valueLine2={form.fields.ownerAddressLine2.value}
                  errorMessages={form.fields.ownerAddressLine1.errorMessages}
                />
                <TownOrCityInput
                  value={form.fields.ownerTownOrCity.value}
                  errorMessages={form.fields.ownerTownOrCity.errorMessages}
                />
                <CountyInput value={form.fields.ownerCounty.value} />
                <PostcodeInput
                  value={form.fields.ownerPostcode.value}
                  errorMessages={form.fields.ownerPostcode.errorMessages}
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

interface BuildingNumberAndStreetInputProps {
  valueLine1: string;
  valueLine2: string;
  errorMessages: string[];
}

const BuildingNumberAndStreetInput: FunctionComponent<
  BuildingNumberAndStreetInputProps
> = ({
  valueLine1 = "",
  valueLine2 = "",
  errorMessages,
}: BuildingNumberAndStreetInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="ownerAddressLine1"
      label="Address line one (building number and street name)"
      defaultValue={valueLine1}
      inputClassName="govuk-!-margin-bottom-2"
    />
    <Input
      id="ownerAddressLine2"
      defaultValue={valueLine2}
      label="Address line two"
    />
  </FormGroup>
);

const TownOrCityInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="ownerTownOrCity" label="Town or city" defaultValue={value} />
  </FormGroup>
);

const CountyInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input id="ownerCounty" label="County (optional)" defaultValue={value} />
  </FormGroup>
);

const PostcodeInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="ownerPostcode" label="Postcode" defaultValue={value} />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPageUrl = CreateRegistrationPageURLs.emergencyContact;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage(
        context,
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<BeaconOwnerAddressForm>(
        context,
        validationRules,
        mapper,
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<BeaconOwnerAddressForm>(
        context,
        validationRules,
        mapper,
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage<BeaconOwnerAddressForm>(
        context,
        validationRules,
        mapper,
        nextPageUrl,
      ),
    ]).execute();
  }),
);

const mapper: DraftRegistrationFormMapper<BeaconOwnerAddressForm> = {
  formToDraftRegistration: (form) => ({
    ownerAddressLine1: form.ownerAddressLine1,
    ownerAddressLine2: form.ownerAddressLine2,
    ownerAddressLine3: "",
    ownerAddressLine4: "",
    ownerTownOrCity: form.ownerTownOrCity,
    ownerCounty: form.ownerCounty,
    ownerPostcode: form.ownerPostcode,
    ownerCountry: "United Kingdom",
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => {
    if (
      draftRegistration.ownerCountry === "United Kingdom" ||
      !draftRegistration.ownerCountry
    ) {
      return {
        ownerAddressLine1: draftRegistration.ownerAddressLine1,
        ownerAddressLine2: draftRegistration.ownerAddressLine2,
        ownerTownOrCity: draftRegistration.ownerTownOrCity,
        ownerCounty: draftRegistration.ownerCounty,
        ownerPostcode: draftRegistration.ownerPostcode,
      };
    } else {
      return {
        ownerAddressLine1: "",
        ownerAddressLine2: "",
        ownerTownOrCity: "",
        ownerCounty: "",
        ownerPostcode: "",
      };
    }
  },
};

const validationRules = ({
  ownerAddressLine1,
  ownerAddressLine2,
  ownerTownOrCity,
  ownerCounty,
  ownerPostcode,
}: BeaconOwnerAddressForm): FormManager => {
  return new FormManager({
    ownerAddressLine1: new FieldManager(ownerAddressLine1, [
      Validators.required(
        "Address line one (building number and street name) is a required field",
      ),
    ]),
    ownerAddressLine2: new FieldManager(ownerAddressLine2),
    ownerTownOrCity: new FieldManager(ownerTownOrCity, [
      Validators.required("Town or city is a required field"),
    ]),
    ownerCounty: new FieldManager(ownerCounty),
    ownerPostcode: new FieldManager(ownerPostcode, [
      Validators.required("Postcode is a required field"),
      Validators.postcode("Postcode must be a valid UK postcode"),
    ]),
  });
};

export default BeaconOwnerAddressUnitedKingdom;
