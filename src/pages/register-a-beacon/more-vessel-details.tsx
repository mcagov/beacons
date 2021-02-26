import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { CacheEntry } from "../../../lib/form/formValidator";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { TextareaCharacterCount } from "../../components/Textarea";
import { FormValidator } from "../../lib/form/formValidator";
import { handlePageRequest } from "../../lib/handlePageRequest";
import { ensureFormDataHasKeys } from "../../lib/utils";

interface MoreVesselDetailsProps {
  formData: CacheEntry;
  needsValidation: boolean;
}

const MoreVesselDetails: FunctionComponent<MoreVesselDetailsProps> = ({
  formData,
  needsValidation = false,
}: MoreVesselDetailsProps): JSX.Element => {
  formData = ensureFormDataHasKeys(formData, "moreVesselDetails");

  const errors = FormValidator.errorSummary(formData);

  const { moreVesselDetails } = FormValidator.validate(formData);

  const pageHeading = "Tell us more about the vessel";

  const pageHasErrors = needsValidation && FormValidator.hasErrors(formData);

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/vessel-communications" />
        }
        title={pageHeading}
        pageHasErrors={pageHasErrors}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary
                errors={errors}
                showErrorSummary={needsValidation}
              />
              <Form action="/register-a-beacon/more-vessel-details">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

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
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <TextareaCharacterCount
      id="moreVesselDetails"
      hintText="Describe the vessel's appearance (such as the length, colour, if it
        has sails or not etc) and any vessel tracking details (e.g. RYA SafeTrx
        or Web) if you have them. This information is very helpful to Search
        & Rescue when trying to locate you."
      maxCharacters={250}
      rows={4}
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-beacon-owner"
);

export default MoreVesselDetails;
