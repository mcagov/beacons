import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  FormLegendPageHeading,
  FormGroup,
  FormHint,
} from "../../components/Form";
import { IfYouNeedHelp } from "../../components/Mca";
import { GetServerSideProps } from "next";
import { withCookieRedirect } from "../../lib/middleware";
import { FieldValidator } from "../../lib/fieldValidator";
import { TextAreaCharacterCount } from "../../components/TextArea";

interface MoreVesselDetailsProps {
  moreVesselDetails: string;
  needsValidation: boolean;
}

const moreVesselDetailsField = new FieldValidator("moreVesselDetails");

moreVesselDetailsField
  .should()
  .containANonEmptyString()
  .withErrorMessage("More vessel details should not be empty");

const MoreVesselDetails: FunctionComponent<MoreVesselDetailsProps> = ({
  moreVesselDetails,
}: MoreVesselDetailsProps): JSX.Element => {
  moreVesselDetailsField.value = moreVesselDetails;

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
              <Form action="/register-a-beacon/more-vessel-details">
                <FormFieldset>
                  <FormLegendPageHeading>
                    Tell us more about the vessel
                  </FormLegendPageHeading>

                  <MoreVesselDetailsTextArea />
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

const MoreVesselDetailsTextArea: FunctionComponent = (): JSX.Element => (
  <TextAreaCharacterCount
    name="moreVesselDetails"
    id="moreVesselDetails"
    maxCharacters={250}
    rows={4}
  >
    <FormGroup>
      <FormHint forId="moreVesselDetails">
        Describe the vessel&apos;s appearance (such as the length, colour, if it
        has sails or not etc) and any vessel tracking details (e.g. RYA SafeTrx
        or Web) if you have them. This information is very helpful to Search
        &amp; Rescue when trying to locate you.
      </FormHint>
    </FormGroup>
  </TextAreaCharacterCount>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async () => {
    return {
      props: {},
    };
  }
);

export default MoreVesselDetails;
