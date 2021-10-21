import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../../components/Button";
import { CountrySelect } from "../../../components/domain/formElements/CountrySelect";
import { FormErrorSummary } from "../../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../../components/Form";
import { Grid } from "../../../components/Grid";
import { Input } from "../../../components/Input";
import { Layout } from "../../../components/Layout";
import { IfYouNeedHelp } from "../../../components/Mca";
import { GovUKBody } from "../../../components/Typography";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../lib/form/FormManager";
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
  ownerAddressLine3: string;
  ownerAddressLine4: string;
  ownerPostcode: string;
  ownerCountry: string;
}

const BeaconOwnerAddressRestOfWorld: FunctionComponent<DraftRegistrationPageProps> =
  ({ form, showCookieBanner }: DraftRegistrationPageProps): JSX.Element => {
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
                    The beacon registration certificate and proof of
                    registration labels to stick to the beacon will be sent to
                    this address
                  </GovUKBody>
                  <RestOfWorldBeaconOwnerAddress form={form} />
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

const RestOfWorldBeaconOwnerAddress: FunctionComponent<{ form: FormJSON }> = ({
  form,
}: {
  form: FormJSON;
}): JSX.Element => (
  <FormGroup>
    <FormGroup errorMessages={form.fields.ownerAddressLine1.errorMessages}>
      <Input
        id="ownerAddressLine1"
        label="Address line 1"
        defaultValue={form.fields.ownerAddressLine1.value}
      />
    </FormGroup>
    <FormGroup errorMessages={form.fields.ownerAddressLine2.errorMessages}>
      <Input
        id="ownerAddressLine2"
        defaultValue={form.fields.ownerAddressLine2.value}
        label="Address line 2"
      />
    </FormGroup>
    <FormGroup>
      <Input
        id="ownerAddressLine3"
        label="Address line 3 (optional)"
        defaultValue={form.fields.ownerAddressLine3.value}
      />
    </FormGroup>
    <FormGroup>
      <Input
        id="ownerAddressLine4"
        label="Address line 4 (optional)"
        defaultValue={form.fields.ownerAddressLine4.value}
      />
    </FormGroup>
    <FormGroup>
      <Input
        id="ownerPostcode"
        label="Postal or zip code (optional)"
        defaultValue={form.fields.ownerPostcode.value}
      />
    </FormGroup>
    <FormGroup errorMessages={form.fields.ownerCountry.errorMessages}>
      <label className="govuk-label" htmlFor="country">
        Country
      </label>
      <CountrySelect
        id="ownerCountry"
        name="ownerCountry"
        defaultValue={form.fields.ownerCountry.value}
      />
    </FormGroup>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPageUrl = CreateRegistrationPageURLs.emergencyContact;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage(
        context
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<BeaconOwnerAddressForm>(
        context,
        validationRules,
        mapper
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<BeaconOwnerAddressForm>(
        context,
        validationRules,
        mapper
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage<BeaconOwnerAddressForm>(
        context,
        validationRules,
        mapper,
        nextPageUrl
      ),
    ]).execute();
  })
);

const mapper: DraftRegistrationFormMapper<BeaconOwnerAddressForm> = {
  formToDraftRegistration: (form) => ({
    ownerAddressLine1: form.ownerAddressLine1,
    ownerAddressLine2: form.ownerAddressLine2,
    ownerAddressLine3: form.ownerAddressLine3,
    ownerAddressLine4: form.ownerAddressLine4,
    ownerTownOrCity: "",
    ownerCounty: "",
    ownerPostcode: form.ownerPostcode,
    ownerCountry: form.ownerCountry,
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => {
    if (
      draftRegistration.ownerCountry === "United Kingdom" ||
      !draftRegistration.ownerCountry
    ) {
      return {
        ownerAddressLine1: "",
        ownerAddressLine2: "",
        ownerAddressLine3: "",
        ownerAddressLine4: "",
        ownerPostcode: "",
        ownerCountry: null,
      };
    } else {
      return {
        ownerAddressLine1: draftRegistration.ownerAddressLine1,
        ownerAddressLine2: draftRegistration.ownerAddressLine2,
        ownerAddressLine3: draftRegistration.ownerAddressLine3,
        ownerAddressLine4: draftRegistration.ownerAddressLine4,
        ownerPostcode: draftRegistration.ownerPostcode,
        ownerCountry: draftRegistration.ownerCountry,
      };
    }
  },
};

const validationRules = ({
  ownerAddressLine1,
  ownerAddressLine2,
  ownerAddressLine3,
  ownerAddressLine4,
  ownerPostcode,
  ownerCountry,
}: BeaconOwnerAddressForm): FormManager => {
  return new FormManager({
    ownerAddressLine1: new FieldManager(ownerAddressLine1, [
      Validators.required("Enter the first line of the beacon owner's address"),
    ]),
    ownerAddressLine2: new FieldManager(ownerAddressLine2, [
      Validators.required(
        "Enter the second line of the beacon owner's address"
      ),
    ]),
    ownerAddressLine3: new FieldManager(ownerAddressLine3),
    ownerAddressLine4: new FieldManager(ownerAddressLine4),
    ownerPostcode: new FieldManager(ownerPostcode),
    ownerCountry: new FieldManager(ownerCountry, [
      Validators.required("Select the country"),
    ]),
  });
};

export default BeaconOwnerAddressRestOfWorld;
