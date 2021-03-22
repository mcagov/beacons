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
import { RadioList, RadioListItem } from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { Purpose } from "../../lib/types";

const definePageForm = ({ purpose }: CacheEntry): FormManager => {
  return new FormManager({
    purpose: new FieldManager(purpose, [
      Validators.required("Beacon use purpose is a required field"),
    ]),
  });
};

const PurposePage: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const environmentChoice = "<maritime/aviation>";
  const pageHeading = `Is your ${environmentChoice} use of this beacon mainly for pleasure or commercial reasons?`;
  const beaconUsePurposeFieldName = "purpose";

  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/environment" />}
        title={pageHeading}
        pageHasErrors={form.hasErrors}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={form.errorSummary} />
              <Form action="/register-a-beacon/purpose">
                <FormGroup errorMessages={form.fields.purpose.errorMessages}>
                  <FormFieldset>
                    <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                    <RadioList>
                      <RadioListItem
                        id="pleasure"
                        name={beaconUsePurposeFieldName}
                        value={Purpose.PLEASURE}
                        label="Personal pleasure"
                        hintText="Choose this if you mainly use the beacon for leisure, or personal trips. If you hire out pleasure craft choose 'commercial-use' instead"
                      />
                      <RadioListItem
                        id="commerical"
                        name={beaconUsePurposeFieldName}
                        value={Purpose.COMMERCIAL}
                        label="Commercial use"
                        hintText="Choose this if you mainly use the beacon for commercial activities such as Fishing, Merchant vessels, Hire of pleasure craft, Delivery Skipper etc"
                      />
                    </RadioList>
                  </FormFieldset>
                  <Button buttonText="Continue" />
                </FormGroup>
              </Form>
              <IfYouNeedHelp />
            </>
          }
        />
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/activity",
  definePageForm
);

export default PurposePage;
