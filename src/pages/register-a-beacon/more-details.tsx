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

interface MoreDetailsTextAreaProps {
  value?: string;
  errorMessages: string[];
}

const definePageForm = ({ moreVesselDetails }: CacheEntry): FormManager => {
  return new FormManager({
    moreVesselDetails: new FieldManager(moreVesselDetails, [
      Validators.required("More details is a required field"),
      Validators.maxLength(
        "More details must be less than 250 characters",
        250
      ),
    ]),
  });
};

const MoreDetails: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Provide more details that could help in a search";

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
              <Form action="/register-a-beacon/more-details">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <div className="govuk-details">
                    <p className="">
                      Please provide a description of any vessel, aircraft,
                      vehicle or anything else associated with this beacon.
                    </p>
                    <p className="">
                      This might include defining features such as the length,
                      colour etc) and any tracking details (e.g. RYA SafeTrx or
                      Web) if you have them.
                    </p>
                    <p className="govuk-!-font-weight-bold">
                      Please do not provide medical details as we cannot store
                      these.
                    </p>
                    <p className="">
                      This information is very helpful to Search and Rescue when
                      trying to locate you
                    </p>
                  </div>
                  <MoreDetailsTextArea
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

const MoreDetailsTextArea: FunctionComponent<MoreDetailsTextAreaProps> = ({
  value = "",
  errorMessages,
}: MoreDetailsTextAreaProps): JSX.Element => (
  <TextareaCharacterCount
    id="moreVesselDetails"
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

export default MoreDetails;
