import React, { FunctionComponent, ReactNode } from "react";
import { FormError } from "../lib/form/formManager";
import { BackButton, Button } from "./Button";
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
}

export const BeaconsForm: FunctionComponent<BeaconsFormProps> = ({
  children,
  previousPageUrl,
  pageHeading,
  showCookieBanner,
  formErrors = [],
  errorMessages = [],
  insetText = null,
}: BeaconsFormProps): JSX.Element => {
  let insetComponent;
  if (insetText) {
    insetComponent = <InsetText>{insetText}</InsetText>;
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
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                </FormFieldset>
                {insetComponent}
                {children}
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
