import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLegendPageHeading,
  FormGroup,
} from "../../components/Form";
import { IfYouNeedHelp } from "../../components/Mca";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { BeaconCacheEntry } from "../../lib/formCache";
import {
  getCache,
  updateFormCache,
  withCookieRedirect,
} from "../../lib/middleware";
import { ErrorSummary } from "../../components/ErrorSummary";
import { FieldValidator } from "../../lib/fieldValidator";

interface MoreVesselDetailsProps {
  moreVesselDetails: string;
  needsValidation: boolean;
}

interface FormInputProps {
  value: string;
  isError: boolean;
  errorMessages: Array<string>;
}

interface ErrorMessageProps {
  id: string;
  message: string;
}

const moreVesselDetailsField = new FieldValidator("moreVesselDetails");

moreVesselDetailsField
  .should()
  .containANonEmptyString()
  .withErrorMessage("More vessel details should not be empty");

const MoreVesselDetails: FunctionComponent<MoreVesselDetailsProps> = ({
  moreVesselDetails,
  needsValidation = false,
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
              {needsValidation && moreVesselDetailsField.hasError() && (
                <ErrorSummaryComponent validators={[moreVesselDetailsField]} />
              )}
              <Form action="/register-a-beacon/more-vessel-details">
                <FormFieldset>
                  <FormLegendPageHeading>
                    Tell us more about the vessel
                  </FormLegendPageHeading>

                  <div className="govuk-body">
                    Describe the vessel&apos;s appearance (such as the length,
                    colour, if it has sails or not etc) and any vessel tracking
                    details (e.g. RYA SafeTrx or Web) if you have them. This
                    information is very helpful to Search &amp; Rescue when
                    trying to locate you.
                  </div>

                  <BeaconVesselMoreDetailsInput
                    value={moreVesselDetails}
                    isError={
                      needsValidation && moreVesselDetailsField.hasError()
                    }
                    errorMessages={moreVesselDetailsField.errorMessages()}
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

interface ErrorSummaryComponentProps {
  validators: FieldValidator[];
}

const ErrorSummaryComponent: FunctionComponent<ErrorSummaryComponentProps> = ({
  validators,
}: ErrorSummaryComponentProps) => (
  <>
    {validators && (
      <ErrorSummary>
        {validators.map((validator, validatorIndex) => {
          return validator.errorMessages().map((errorMessage, errorIndex) => {
            return (
              <li key={`${validator.fieldId}-${validatorIndex}-${errorIndex}`}>
                {/*TODO: href should go to the component error message, e.g. `hexId-error-0`*/}
                <a href={`#${validator.fieldId}`}>{errorMessage}</a>
              </li>
            );
          });
        })}
      </ErrorSummary>
    )}
  </>
);

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  id,
  message,
}: ErrorMessageProps) => (
  <span id={id} className="govuk-error-message">
    <span className="govuk-visually-hidden">Error:</span> {message}
  </span>
);

const BeaconVesselMoreDetailsInput: FunctionComponent<FormInputProps> = ({
  value = "",
  isError,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup hasError={isError}>
    {isError &&
      errorMessages.map((message, index) => (
        <ErrorMessage
          id={`more-vessel-details-error-${index}`}
          key={`more-vessel-details-error-${index}`}
          message={message}
        />
      ))}
    <Input
      name="moreVesselDetails"
      id="moreVesselDetails"
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    if (context.req.method === "POST") {
      const formData: BeaconCacheEntry = await updateFormCache(context);

      moreVesselDetailsField.value = formData.manufacturer;

      if (moreVesselDetailsField.hasError()) {
        return {
          props: {
            needsValidation: true,
            // moreVesselDetails: formData.moreVesselDetails TODO remove uncomment when implemented on the cache
          },
        };
      } else {
        return {
          redirect: {
            destination: "/register-a-beacon/beacon-owner", // TODO check path strategy / 303 status code etc
            permanent: false,
          },
        };
      }
    }

    const formData: BeaconCacheEntry = getCache(context);

    return {
      props: {
        needsValidation: false,
        ...formData,
      },
    };
  }
);

export default MoreVesselDetails;
