import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
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
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

interface MoreVesselDetailsTextAreaProps {
  value?: string;
  errorMessages: string[];
}

const definePageForm = ({ moreVesselDetails }: CacheEntry): FormManager => {
  return new FormManager({
    moreVesselDetails: new FieldManager(moreVesselDetails, [
      Validators.required("Vessel details is a required field"),
      Validators.maxLength(
        "Vessel details must be less than 250 characters",
        250
      ),
    ]),
  });
};

const MoreVesselDetails: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Tell us more about the vessel";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/vessel-communications" />
        }
        title={pageHeading}
        pageHasErrors={form.hasErrors}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={form.errorSummary} />
              <Form action="/register-a-beacon/more-vessel-details">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <MoreVesselDetailsTextArea
                    value={form.fields.moreVesselDetails.value}
                    errorMessages={form.fields.moreVesselDetails.errorMessages}
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
  <TextareaCharacterCount
    id="moreVesselDetails"
    hintText="Describe the vessel's appearance (such as the length, colour, if it
        has sails or not etc) and any vessel tracking details (e.g. RYA SafeTrx
        or Web) if you have them. This information is very helpful to Search
        and Rescue when trying to locate you."
    maxCharacters={250}
    rows={4}
    defaultValue={value}
    errorMessages={errorMessages}
  />
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-beacon-owner",
  definePageForm
);

export default MoreVesselDetails;
