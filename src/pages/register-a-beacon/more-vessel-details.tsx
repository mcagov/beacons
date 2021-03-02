import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
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
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { handlePageRequest } from "../../lib/handlePageRequest";

interface MoreVesselDetailsProps {
  formData: CacheEntry;
  needsValidation: boolean;
}

interface MoreVesselDetailsTextAreaProps {
  value?: string;
  errorMessages: string[];
}

const getFormManager = ({ moreVesselDetails }: CacheEntry): FormManager => {
  return new FormManager({
    moreVesselDetails: new FieldManager(moreVesselDetails, [
      Validators.required("Vessel details is a required fied"),
      Validators.maxLength(
        "Vessel details must be less than 250 characters",
        250
      ),
    ]),
  });
};

const MoreVesselDetails: FunctionComponent<MoreVesselDetailsProps> = ({
  formData,
  needsValidation = false,
}: MoreVesselDetailsProps): JSX.Element => {
  const formManager = getFormManager(formData);
  if (needsValidation) {
    formManager.markAsDirty();
  }
  const fields = formManager.fields;
  const pageHeading = "Tell us more about the vessel";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/vessel-communications" />
        }
        title={pageHeading}
        pageHasErrors={formManager.hasErrors()}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={formManager.errorSummary()} />
              <Form action="/register-a-beacon/more-vessel-details">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <MoreVesselDetailsTextArea
                    value={fields.moreVesselDetails.value}
                    errorMessages={fields.moreVesselDetails.errorMessages()}
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

const MoreVesselDetailsTextArea: FunctionComponent<MoreVesselDetailsTextAreaProps> = ({
  value = "",
  errorMessages,
}: MoreVesselDetailsTextAreaProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
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
  "/register-a-beacon/about-beacon-owner",
  getFormManager
);

export default MoreVesselDetails;
