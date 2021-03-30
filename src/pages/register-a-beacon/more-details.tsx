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
import { GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

interface MoreDetailsTextAreaProps {
  id: string;
  value?: string;
  errorMessages: string[];
}

const definePageForm = ({ moreDetails }: FormSubmission): FormManager => {
  return new FormManager({
    moreDetails: new FieldManager(moreDetails, [
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
              <Form>
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <GovUKBody>
                    Please provide a description of any vessel, aircraft,
                    vehicle or anything else associated with this beacon.
                  </GovUKBody>
                  <GovUKBody>
                    This might include defining features such as the length,
                    colour etc) and any tracking details (e.g. RYA SafeTrx or
                    Web) if you have them.
                  </GovUKBody>
                  <GovUKBody className="govuk-!-font-weight-bold">
                    Please do not provide medical details as we cannot store
                    these.
                  </GovUKBody>
                  <GovUKBody>
                    This information is very helpful to Search and Rescue when
                    trying to locate you
                  </GovUKBody>
                  <MoreDetailsTextArea
                    id="moreDetails"
                    value={form.fields.moreDetails.value}
                    errorMessages={form.fields.moreDetails.errorMessages}
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
  id,
  value = "",
  errorMessages,
}: MoreDetailsTextAreaProps): JSX.Element => (
  <TextareaCharacterCount
    id={id}
    maxCharacters={250}
    rows={4}
    defaultValue={value}
    errorMessages={errorMessages}
  />
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/additional-beacon-use",
  definePageForm
);

export default MoreDetails;
