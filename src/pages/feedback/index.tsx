import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm, BeaconsFormHeading } from "../../components/BeaconsForm";
import { Button } from "../../components/Button";
import { FormFieldset, FormGroup, FormLegend } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { TextareaCharacterCount } from "../../components/Textarea";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { withoutErrorMessages } from "../../lib/form/lib";
import { DraftRegistrationPageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { GeneralPageURLs } from "../../lib/urls";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { WhenUserSubmitsFeedback } from "../../router/rules/WhenUserSubmitsFeedback";
import { WhenUserViewsPage_ThenDisplayPage } from "../../router/rules/WhenUserViewsPage_ThenDisplayPage";

export const Feedback: FunctionComponent<DraftRegistrationPageProps> = ({
  form = withoutErrorMessages({}, validationRules),
  showCookieBanner,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Give feedback on Register a beacon";
  const fieldName = "satisfactionRating";

  const sendFeedbackButton = <Button buttonText="Send feedback" />;

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={GeneralPageURLs.start}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      includeUseIndex={false}
      continueButton={sendFeedbackButton}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />
      <FormGroup>
        <FormFieldset>
          <FormLegend>
            Overall, how do you feel about the service you received today?
          </FormLegend>
          <RadioList>
            <RadioListItem
              id="verySatisfied"
              name={fieldName}
              label="Very satisfied"
              value="verySatisfied"
            />
            <RadioListItem
              id="satisfied"
              name={fieldName}
              label="Satisfied"
              value="satisfied"
            />
            <RadioListItem
              id="neitherSatisfiedOrDissatisfied"
              name={fieldName}
              label="Neither satisfied or dissatisfied"
              value="neitherSatisfiedOrDissatisfied"
            />
            <RadioListItem
              id="dissatisfied"
              name={fieldName}
              label="Dissatisfied"
              value="dissatisfied"
            />
            <RadioListItem
              id="veryDissatisfied"
              name={fieldName}
              label="Very dissatisfied"
              value="veryDissatisfied"
            />
          </RadioList>
        </FormFieldset>
      </FormGroup>
      <TextareaCharacterCount
        id="howCouldWeImproveThisService"
        label="How could we improve this service?"
        hintText="Do not include any personal or financial information, for example your National Insurance or credit card numbers."
        maxCharacters={1200}
        rows={4}
      />
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserSubmitsFeedback(context, validationRules),
      new WhenUserViewsPage_ThenDisplayPage(context),
    ]).execute();
  })
);

export const validationRules = ({
  satisfactionRating,
  howCouldWeImproveThisService,
}) => {
  return new FormManager({
    satisfactionRating: new FieldManager(satisfactionRating),
    howCouldWeImproveThisService: new FieldManager(
      howCouldWeImproveThisService
    ),
  });
};

export default Feedback;
