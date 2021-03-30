import { useRouter } from "next/router";
import React, { FunctionComponent, ReactNode } from "react";
import { FormError } from "../lib/form/formManager";
import { BackButton, BackButtonRouterIndexes, Button } from "./Button";
import { FormErrorSummary } from "./ErrorSummary";
import { Form, FormFieldset, FormGroup, FormLegendPageHeading } from "./Form";
import { Grid } from "./Grid";
import { InsetText } from "./InsetText";
import { Layout } from "./Layout";
import { IfYouNeedHelp } from "./Mca";

interface BeaconsFormProps {
  children: ReactNode;
  previousPageUrl: string;
  pageHeading: string;
  showCookieBanner: boolean;
  formErrors?: FormError[];
  errorMessages?: string[];
  insetText?: ReactNode;
  includeUseIndex?: boolean;
}

export const BeaconsForm: FunctionComponent<BeaconsFormProps> = ({
  children,
  previousPageUrl,
  pageHeading,
  showCookieBanner,
  formErrors = [],
  errorMessages = [],
  insetText = null,
  includeUseIndex = true,
}: BeaconsFormProps): JSX.Element => {
  let insetComponent: ReactNode;
  if (insetText) {
    insetComponent = <InsetText>{insetText}</InsetText>;
  }

  const backButton: ReactNode = includeUseIndex ? (
    <BackButtonRouterIndexes href={previousPageUrl} />
  ) : (
    <BackButton href={previousPageUrl} />
  );

  return (
    <Layout
      navigation={backButton}
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
                </FormFieldset>
                {insetComponent}
                {children}
                <HiddenInput />
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

const HiddenInput: FunctionComponent = () => {
  const router = useRouter();
  const useIndexValue = router?.query.useIndex || 0;

  return (
    <input id="use-index" type="hidden" name="useIndex" value={useIndexValue} />
  );
};
