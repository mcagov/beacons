import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  FieldErrorList,
  FormErrorSummary,
} from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormHint,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { TextAreaCharacterCount } from "../../components/TextArea";
import { VesselCacheEntry } from "../../lib/formCache";
import { FormValidator } from "../../lib/formValidator";
import { updateFormCache, withCookieRedirect } from "../../lib/middleware";
import { ensureFormDataHasKeys } from "../../lib/utils";

interface MoreVesselDetailsProps {
  formData: VesselCacheEntry;
  needsValidation: boolean;
}

const MoreVesselDetails: FunctionComponent<MoreVesselDetailsProps> = ({
  formData,
  needsValidation = false,
}: MoreVesselDetailsProps): JSX.Element => {
  formData = ensureFormDataHasKeys(formData, "moreVesselDetails");

  const errors = FormValidator.errorSummary(formData);

  const { moreVesselDetails } = FormValidator.validate(formData);

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/vessel-communication-details" />
        }
      >
        <Grid
          mainContent={
            <>
              {needsValidation && <FormErrorSummary errors={errors} />}
              <Form action="/register-a-beacon/more-vessel-details">
                <FormFieldset>
                  <FormLegendPageHeading>
                    Tell us more about the vessel
                  </FormLegendPageHeading>

                  <MoreVesselDetailsTextArea
                    value={formData.moreVesselDetails}
                    showErrors={needsValidation && moreVesselDetails.invalid}
                    errorMessages={moreVesselDetails.errorMessages}
                  />
                </FormFieldset>
                <Button buttonText="Continue" />
              </Form>
              <IfYouNeedHelp />
            </>
          }
        />
      </Layout>
    </>
  );
};

interface MoreVesselDetailsTextAreaProps {
  value?: string;
  showErrors: boolean;
  errorMessages: string[];
}

const MoreVesselDetailsTextArea: FunctionComponent<MoreVesselDetailsTextAreaProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: MoreVesselDetailsTextAreaProps): JSX.Element => (
  <FormGroup showErrors={showErrors}>
    <TextAreaCharacterCount
      name="moreVesselDetails"
      id="moreVesselDetails"
      maxCharacters={250}
      rows={4}
      value={value}
    >
      <FormHint forId="moreVesselDetails">
        Describe the vessel&apos;s appearance (such as the length, colour, if it
        has sails or not etc) and any vessel tracking details (e.g. RYA SafeTrx
        or Web) if you have them. This information is very helpful to Search
        &amp; Rescue when trying to locate you.
      </FormHint>
      {showErrors && <FieldErrorList errorMessages={errorMessages} />}
    </TextAreaCharacterCount>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    const formData: VesselCacheEntry = await updateFormCache(context);

    const userDidSubmitForm = context.req.method === "POST";
    const formIsValid = !FormValidator.hasErrors(formData);

    if (userDidSubmitForm && formIsValid) {
      return {
        redirect: {
          statusCode: 303,
          destination: "/register-a-beacon/beacon-information",
        },
      };
    }

    return {
      props: {
        formData,
        needsValidation: userDidSubmitForm,
      },
    };
  }
);

export default MoreVesselDetails;
