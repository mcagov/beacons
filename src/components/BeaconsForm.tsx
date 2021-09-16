import { useRouter } from "next/router";
import React, { FunctionComponent, ReactNode } from "react";
import { FormError } from "../lib/form/FormManager";
import { BackButton, Button } from "./Button";
import { FormErrorSummary } from "./ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLabel,
  FormLegendPageHeading,
} from "./Form";
import { Grid } from "./Grid";
import { Layout } from "./Layout";
import { IfYouNeedHelp } from "./Mca";

interface BeaconsFormProps {
  children: ReactNode;
  previousPageUrl: string;
  pageHeading: string;
  showCookieBanner: boolean;
  formErrors?: FormError[];
  errorMessages?: string[];
  includeUseId?: boolean;
  continueButton?: JSX.Element;
  cancelButton?: JSX.Element;
}

interface BeaconsFormFieldsetAndLegendProps {
  children: ReactNode;
  pageHeading: string;
  ariaDescribedBy?: string;
}

interface BeaconsFormHeadingProps {
  pageHeading: string;
}

interface BeaconsFormLabelHeadingProps {
  pageHeading: string;
  id: string;
}

export const BeaconsForm: FunctionComponent<BeaconsFormProps> = ({
  children,
  previousPageUrl,
  pageHeading,
  showCookieBanner,
  formErrors = [],
  errorMessages = [],
  continueButton = <Button buttonText="Continue" />,
  cancelButton = null,
}: BeaconsFormProps): JSX.Element => {
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
  const useIdValue = router?.query.useId || 0;

  return <input id="use-index" type="hidden" name="useId" value={useIdValue} />;
};

export const BeaconsFormFieldsetAndLegend: FunctionComponent<BeaconsFormFieldsetAndLegendProps> =
  ({
    children,
    pageHeading,
    ariaDescribedBy = null,
  }: BeaconsFormFieldsetAndLegendProps): JSX.Element => {
    return (
      <FormFieldset ariaDescribedBy={ariaDescribedBy}>
        <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
        {children}
      </FormFieldset>
    );
  };

export const BeaconsFormHeading: FunctionComponent<BeaconsFormHeadingProps> = ({
  pageHeading,
}: BeaconsFormHeadingProps): JSX.Element => {
  return (
    <h1 className="govuk-heading-l govuk-!-margin-bottom-3">{pageHeading}</h1>
  );
};

export const BeaconsFormLabelHeading: FunctionComponent<BeaconsFormLabelHeadingProps> =
  ({ pageHeading, id = null }: BeaconsFormLabelHeadingProps): JSX.Element => {
    return (
      <h1 className="govuk-label-wrapper">
        <FormLabel htmlFor={id} className="govuk-label--l">
          {pageHeading}
        </FormLabel>
      </h1>
    );
  };
