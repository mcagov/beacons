import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { Button, LinkButton } from "../../../components/Button";
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
import { GovUKBody, SectionHeading } from "../../../components/Typography";
import { AccountHolder } from "../../../entities/AccountHolder";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../lib/form/FormManager";
import { Validators } from "../../../lib/form/Validators";
import { FormManagerFactory } from "../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { redirectUserTo } from "../../../lib/redirectUserTo";
import { AccountPageURLs } from "../../../lib/urls";
import { diffObjValues } from "../../../lib/utils";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

export interface UpdateAccountPageProps {
  form: FormJSON;
  accountHolderDetails: AccountHolder;
}

const UnitedKingdom: FunctionComponent<UpdateAccountPageProps> = ({
  form,
}: UpdateAccountPageProps): JSX.Element => {
  const pageHeading =
    "Update your details as the Beacon Registry Account Holder";

  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <Grid
        mainContent={
          <>
            <FormErrorSummary formErrors={form.errorSummary} />
            <Form>
              <FormGroup>
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <GovUKBody>
                    We will send this person confirmation messages, certificates
                    and account reminders. You can provide details of the beacon
                    owner (if this is a different person or organisation) later.
                  </GovUKBody>
                </FormFieldset>

                <SectionHeading>About you</SectionHeading>
                <FullName
                  value={form.fields.fullName.value}
                  errorMessages={form.fields.fullName.errorMessages}
                />

                <TelephoneNumber
                  value={form.fields.telephoneNumber.value}
                  errorMessages={form.fields.telephoneNumber.errorMessages}
                />
                <RestOfWorldAccountHolderAddress form={form} />
              </FormGroup>
              <Button buttonText="Save these account details" />
              &nbsp;
              <LinkButton
                buttonText="Cancel"
                href={AccountPageURLs.accountHome}
                classes="govuk-button--secondary"
              />
            </Form>
            <GovUKBody>
              Your registered email address is {form.fields.email.value}.
              <br />
              We will send your registration confirmation and certificate to
              this email.
            </GovUKBody>
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const FullName: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="fullName" label="Your full name" defaultValue={value} />
  </FormGroup>
);

const TelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="telephoneNumber"
      label="Telephone number"
      hintText="Search and rescue may use this to try you in an emergency. This can be a mobile or landline. For international numbers include the country code."
      defaultValue={value}
    />
  </FormGroup>
);

const RestOfWorldAccountHolderAddress: FunctionComponent<{ form: FormJSON }> =
  ({ form }: { form: FormJSON }): JSX.Element => (
    <FormGroup>
      <FormGroup errorMessages={form.fields.addressLine1.errorMessages}>
        <Input
          id="addressLine1"
          label="Address line 1"
          defaultValue={form.fields.addressLine1.value}
        />
      </FormGroup>
      <FormGroup>
        <Input
          id="addressLine2"
          defaultValue={form.fields.addressLine2.value}
          label="Address line 2"
        />
      </FormGroup>
      <FormGroup errorMessages={form.fields.addressLine3.errorMessages}>
        <Input
          id="addressLine3"
          label="Address line 3 (optional)"
          defaultValue={form.fields.addressLine3.value}
        />
      </FormGroup>
      <FormGroup errorMessages={form.fields.addressLine4.errorMessages}>
        <Input
          id="addressLine4"
          label="Address line 4 (optional)"
          defaultValue={form.fields.addressLine4.value}
        />
      </FormGroup>
      <FormGroup errorMessages={form.fields.postcode.errorMessages}>
        <Input
          id="postcode"
          label="Postal or zip code (optional)"
          defaultValue={form.fields.postcode.value}
        />
      </FormGroup>
      <FormGroup errorMessages={form.fields.country.errorMessages}>
        <Input
          id="country"
          label="Country"
          defaultValue={form.fields.country.value}
        />
      </FormGroup>
    </FormGroup>
  );

const userDidSubmitForm = (
  context: BeaconsGetServerSidePropsContext
): boolean => context.req.method === "POST";

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const rule = new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(
      context
    );
    if (await rule.condition()) {
      return rule.action();
    }

    const { parseFormDataAs, updateAccountHolder, getOrCreateAccountHolder } =
      context.container;

    if (!userDidSubmitForm(context)) {
      const accountHolder: AccountHolder = await getOrCreateAccountHolder(
        context.session
      );
      const accountHolderWithoutAddress: AccountHolder = {
        ...accountHolder,
        addressLine1: undefined,
        addressLine2: undefined,
        addressLine3: undefined,
        addressLine4: undefined,
        townOrCity: undefined,
        county: undefined,
        postcode: undefined,
        country: undefined,
      };
      return {
        props: {
          form: restOfWorldFormManager(
            accountHolderToRestOfWorldUpdateFields(accountHolderWithoutAddress)
          ).serialise(),
        },
      };
    }

    const formData = await parseFormDataAs<RestOfWorldAccountUpdateFields>(
      context.req
    );
    const formManager = restOfWorldFormManager(formData).asDirty();
    if (formManager.hasErrors()) {
      return {
        props: {
          form: formManager.serialise(),
        },
      };
    }

    const accountHolder = await getOrCreateAccountHolder(context.session);
    const update = diffObjValues(
      accountHolderToRestOfWorldUpdateFields(accountHolder),
      formData
    );
    await updateAccountHolder(accountHolder.id, update as AccountHolder);

    return redirectUserTo(AccountPageURLs.accountHome);
  })
);

const restOfWorldUpdateFieldsToAccountHolder = (
  restOfWorldForm: RestOfWorldAccountUpdateFields
): AccountHolder => ({
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  addressLine4: "",
  alternativeTelephoneNumber: "",
  country: "",
  county: "",
  email: "",
  fullName: "",
  id: "",
  postcode: "",
  telephoneNumber: "",
  townOrCity: "",
});

export default UnitedKingdom;

/**
 * Turns an account holder in to a set of update fields
 * @param accountHolder {AccountHolder} the account holder from which to populate these fields
 * @returns {RestOfWorldAccountUpdateFields} update field values from accountHolder or properties are undefined (to allow for obj diffing)
 */
const accountHolderToRestOfWorldUpdateFields = (
  accountHolder: AccountHolder
): RestOfWorldAccountUpdateFields => ({
  fullName: accountHolder.fullName || undefined,
  telephoneNumber: accountHolder.telephoneNumber || undefined,
  addressLine1: accountHolder.addressLine1 || undefined,
  addressLine2: accountHolder.addressLine2 || undefined,
  addressLine3: accountHolder.addressLine3 || undefined,
  addressLine4: accountHolder.addressLine4 || undefined,
  postcode: accountHolder.postcode || undefined,
  country: accountHolder.country || undefined,
  email: accountHolder.email,
});

interface RestOfWorldAccountUpdateFields {
  fullName: string;
  telephoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  postcode: string;
  country: string;
  email: string;
}

export const restOfWorldFormManager: FormManagerFactory = ({
  fullName,
  telephoneNumber,
  addressLine1,
  addressLine2,
  addressLine3,
  addressLine4,
  postcode,
  country,
  email,
}) => {
  return new FormManager({
    fullName: new FieldManager(fullName, [
      Validators.required("Enter your full name"),
    ]),
    telephoneNumber: new FieldManager(telephoneNumber, [
      Validators.required("Enter your telephone number"),
      Validators.phoneNumber(
        "Enter a telephone number, like 07700 982736 or +447700912738"
      ),
    ]),
    addressLine1: new FieldManager(addressLine1, [
      Validators.required("Enter the first line of your address"),
    ]),
    addressLine2: new FieldManager(addressLine2, [
      Validators.required("Enter the second line of your address"),
    ]),
    addressLine3: new FieldManager(addressLine3),
    addressLine4: new FieldManager(addressLine4),
    postcode: new FieldManager(postcode),
    country: new FieldManager(country, [
      Validators.required("Enter your country"),
    ]),
    email: new FieldManager(email),
  });
};
