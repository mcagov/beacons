import { useRouter } from "next/router";
import React, { FunctionComponent, ReactNode } from "react";
import { FormError } from "../lib/form/FormManager";
import { BackButton, Button } from "./Button";
import { FormErrorSummary } from "./ErrorSummary";
import { Form, FormFieldset, FormGroup, FormLegendPageHeading } from "./Form";
import { Grid } from "./Grid";
import { Layout } from "./Layout";
import { IfYouNeedHelp } from "./Mca";
import { GovUKBody } from "./Typography";

interface BeaconsFormProps {
  children: ReactNode;
  previousPageUrl: string;
  pageHeading: string;
  showCookieBanner: boolean;
  formErrors?: FormError[];
  errorMessages?: string[];
  pageText?: string | ReactNode;
  includeUseIndex?: boolean;
  continueButton?: JSX.Element;
  cancelButton?: JSX.Element;
  id?: string;
  displayLabelledHeading?: boolean;
  displayFormFieldsetAndLegend?: boolean;
}

export const BeaconsForm: FunctionComponent<BeaconsFormProps> = ({
  children,
  previousPageUrl,
  pageHeading,
  showCookieBanner,
  formErrors = [],
  errorMessages = [],
  pageText = null,
  continueButton = <Button buttonText="Continue" />,
  cancelButton = null,
  displayLabelledHeading = false,
  displayFormFieldsetAndLegend = false,
  id = "",
}: BeaconsFormProps): JSX.Element => {
  const pageTextComponent: ReactNode =
    typeof pageText === "string" ? <GovUKBody>{pageText}</GovUKBody> : pageText;

  if (displayFormFieldsetAndLegend) {
    return (
      <Layout
        navigation={<BackButton href={previousPageUrl} />}
        title={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={formErrors} />
              <Form>
                <FormGroup errorMessages={errorMessages}>
                  <FormFieldset>
                    <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                    {pageTextComponent}
                    {children}
                  </FormFieldset>
                  <HiddenFormMetadata />
                </FormGroup>
                {cancelButton}
                {continueButton}
              </Form>
              <IfYouNeedHelp />
            </>
          }
        />
      </Layout>
    );
  }

  if (displayLabelledHeading) {
    return (
      <Layout
        navigation={<BackButton href={previousPageUrl} />}
        title={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={formErrors} />
              <Form>
                <FormGroup errorMessages={errorMessages}>
                  <h1 className="govuk-heading-l govuk-!-margin-bottom-3">
                    <label htmlFor={id}>{pageHeading}</label>
                  </h1>
                  {pageTextComponent}
                  {children}
                  <HiddenFormMetadata />
                </FormGroup>
                {cancelButton}
                {continueButton}
              </Form>
              <IfYouNeedHelp />
            </>
          }
        />
      </Layout>
    );
  }

  return (
    <Layout
      navigation={<BackButton href={previousPageUrl} />}
      title={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <Grid
        mainContent={
          <>
            <FormErrorSummary formErrors={formErrors} />
            <Form>
              <FormGroup errorMessages={errorMessages}>
                <h1 className="govuk-heading-l govuk-!-margin-bottom-3">
                  {pageHeading}
                </h1>
                {pageTextComponent}
                {children}
                <HiddenFormMetadata />
              </FormGroup>
              {cancelButton}
              {continueButton}
            </Form>
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const HiddenFormMetadata: FunctionComponent = () => {
  const router = useRouter();
  const useIndexValue = router?.query.useIndex || 0;

  return (
    <input id="use-index" type="hidden" name="useIndex" value={useIndexValue} />
  );
};
