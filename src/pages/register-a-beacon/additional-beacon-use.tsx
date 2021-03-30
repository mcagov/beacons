import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handleGetRequest } from "../../lib/handlePageRequest";
import {
  BeaconsContext,
  decorateGetServerSidePropsContext,
} from "../../lib/middleware";

const definePageForm = ({
  additionalBeaconUse,
}: FormSubmission): FormManager => {
  return new FormManager({
    additionalBeaconUse: new FieldManager(additionalBeaconUse, [
      Validators.required("Additional beacon use is a required field"),
    ]),
  });
};

const AdditionalBeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}): JSX.Element => {
  const previousPageUrl = "/register-a-beacon/more-details";
  const pageHeading = "Do you have other additional uses for this beacon?";
  const additionalBeaconName = "additionalBeaconUse";

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      previousPageUrl={previousPageUrl}
      formErrors={form.errorSummary}
      showCookieBanner={showCookieBanner}
    >
      <FormGroup>
        <RadioList>
          <RadioListItem
            id="yes"
            name={additionalBeaconName}
            value="true"
            label="Yes"
            hintText="We'll ask you to tell us about these in the next step"
          />

          <RadioListItem
            id="no"
            name={additionalBeaconName}
            value="false"
            label="No"
          />
        </RadioList>
      </FormGroup>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const beaconsContext: BeaconsContext = await decorateGetServerSidePropsContext(
    context
  );

  if (context.req.method === "POST") {
  } else {
    return handleGetRequest(beaconsContext, definePageForm);
  }
};

export default AdditionalBeaconUse;
