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
import { FormJSON } from "../../../lib/form/FormManager";
import { accountDetailsFormManager } from "../../../lib/form/formManagers/accountDetailsFormManager";
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
                    and and account reminders. You can provide details of the
                    beacon owner (if this is a different person or organisation)
                    later.
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
                <AccountHolderAddress form={form} />
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

const AccountHolderAddress: FunctionComponent<{ form: FormJSON }> = ({
  form,
}: {
  form: FormJSON;
}): JSX.Element => (
  <FormGroup>
    <FormGroup errorMessages={form.fields.addressLine1.errorMessages}>
      <Input
        id="addressLine1"
        label="Address line one (building number and street name)"
        defaultValue={form.fields.addressLine1.value}
      />
    </FormGroup>
    <FormGroup>
      <Input
        id="addressLine2"
        defaultValue={form.fields.addressLine2.value}
        label="Address line two"
      />
    </FormGroup>
    <FormGroup errorMessages={form.fields.townOrCity.errorMessages}>
      <Input
        id="townOrCity"
        label="Town or city"
        defaultValue={form.fields.townOrCity.value}
      />
    </FormGroup>
    <FormGroup errorMessages={form.fields.county.errorMessages}>
      <Input
        id="county"
        label="County (optional)"
        defaultValue={form.fields.county.value}
      />
    </FormGroup>
    <FormGroup errorMessages={form.fields.postcode.errorMessages}>
      <Input
        id="postcode"
        label="Postcode"
        defaultValue={form.fields.postcode.value}
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
      return {
        props: {
          form: accountDetailsFormManager(
            accountUpdateFields(await getOrCreateAccountHolder(context.session))
          ).serialise(),
        },
      };
    }

    const formData = await parseFormDataAs<AccountUpdateFields>(context.req);
    const formManager = accountDetailsFormManager(formData).asDirty();
    if (formManager.hasErrors()) {
      return {
        props: {
          form: formManager.serialise(),
        },
      };
    }

    const accountHolder = await getOrCreateAccountHolder(context.session);
    const update = diffObjValues(accountUpdateFields(accountHolder), formData);
    await updateAccountHolder(accountHolder.id, update as AccountHolder);

    return redirectUserTo(AccountPageURLs.accountHome);
  })
);

export default UnitedKingdom;

/**
 * Turns an account holder in to a set of update fields
 * @param accountHolder {AccountHolder} the account holder from which to populate these fields
 * @returns {AccountUpdateFields} update field values from accountHolder or properties are undefined (to allow for obj diffing)
 */
const accountUpdateFields = (
  accountHolder: AccountHolder
): AccountUpdateFields => ({
  fullName: accountHolder.fullName || undefined,
  telephoneNumber: accountHolder.telephoneNumber || undefined,
  addressLine1: accountHolder.addressLine1 || undefined,
  addressLine2: accountHolder.addressLine2 || undefined,
  townOrCity: accountHolder.townOrCity || undefined,
  county: accountHolder.county || undefined,
  postcode: accountHolder.postcode || undefined,
  email: accountHolder.email,
});

interface AccountUpdateFields {
  fullName: string;
  telephoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  townOrCity: string;
  county: string;
  postcode: string;
  email: string;
}
