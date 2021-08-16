import { useRouter } from "next/router";
import React, { FunctionComponent, ReactNode } from "react";
import { FormError } from "../lib/form/FormManager";
import { BackButton, Button } from "./Button";
import { FormErrorSummary } from "./ErrorSummary";
import { Form, FormGroup } from "./Form";
import { Grid } from "./Grid";
import { Layout } from "./Layout";
import { IfYouNeedHelp } from "./Mca";
import { GovUKBody } from "./Typography";

interface NoFieldSetOrLegendFormProps {
  children: ReactNode;
  previousPageUrl: string;
  pageHeading: string;
  showCookieBanner: boolean;
  formErrors?: FormError[];
  errorMessages?: string[];
  pageText?: string | ReactNode;
  includeUseIndex?: boolean;
}

export const NoFieldSetOrLegendForm: FunctionComponent<NoFieldSetOrLegendFormProps> =
  ({
    children,
    previousPageUrl,
    pageHeading,
    showCookieBanner,
    formErrors = [],
    errorMessages = [],
    pageText = null,
  }: NoFieldSetOrLegendFormProps): JSX.Element => {
    const pageTextComponent: ReactNode =
      typeof pageText === "string" ? (
        <GovUKBody>{pageText}</GovUKBody>
      ) : (
        pageText
      );

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
                <Button buttonText="Continue" />
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
