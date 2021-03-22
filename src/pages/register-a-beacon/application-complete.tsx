import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Panel } from "../../components/Panel";
import { GovUKBody } from "../../components/Typography";
import { WarningText } from "../../components/WarningText";
import { GovNotifyGateway } from "../../gateways/gov-notify-api-gateway";
import { CacheEntry } from "../../lib/formCache";
import { getCache, withCookieRedirect } from "../../lib/middleware";
import { joinStrings, referenceNumber } from "../../lib/utils";

interface ApplicationCompleteProps {
  formData: CacheEntry;
}

const ApplicationCompletePage: FunctionComponent<ApplicationCompleteProps> = ({
  formData,
}: ApplicationCompleteProps): JSX.Element => {
  const pageHeading = "Application Complete";
  let pageSubHeading =
    process.env.NEXT_PUBLIC_GOV_NOTIFY_CUSTOMER_EMAIL_TEMPLATE;
  if (process.env.NEXT_PUBLIC_GOV_NOTIFY_CUSTOMER_EMAIL_TEMPLATE) {
    const govNotifyGateway = new GovNotifyGateway();

    govNotifyGateway.sendEmail(
      process.env.NEXT_PUBLIC_GOV_NOTIFY_CUSTOMER_EMAIL_TEMPLATE,
      formData.beaconOwnerEmail,
      {
        owner_name: formData.beaconOwnerFullName,
        reference: referenceNumber("A#", 7),
        beacon_information: joinStrings([
          formData.manufacturer,
          formData.model,
          formData.hexId,
        ]),
        owner_details: joinStrings([
          formData.beaconOwnerFullName,
          formData.beaconOwnerTelephoneNumber,
          formData.beaconOwnerAlternativeTelephoneNumber,
          formData.beaconOwnerEmail,
        ]),
        owner_address: joinStrings([
          formData.beaconOwnerAddressLine1,
          formData.beaconOwnerAddressLine2,
          formData.beaconOwnerTownOrCity,
          formData.beaconOwnerPostcode,
        ]),
        emergency_contact_1_name: formData.emergencyContact1FullName,
        emergency_contact_1_telephone_number:
          formData.emergencyContact1TelephoneNumber,
        emergency_contact_1_alternative_telephone_number:
          formData.emergencyContact1AlternativeTelephoneNumber,
        emergency_contact_2_name: formData.emergencyContact2FullName,
        emergency_contact_2_telephone_number:
          formData.emergencyContact2TelephoneNumber,
        emergency_contact_2_alternative_telephone_number:
          formData.emergencyContact2AlternativeTelephoneNumber,
        emergency_contact_3_name: formData.emergencyContact3FullName,
        emergency_contact_3_telephone_number:
          formData.emergencyContact3TelephoneNumber,
        emergency_contact_3_alternative_telephone_number:
          formData.emergencyContact3AlternativeTelephoneNumber,
      }
    );

    pageSubHeading = "We have sent you a confirmation email.";
  }

  if (!pageSubHeading) {
    //pageSubHeading += "We could not send you a confirmation email.";
  }

  return (
    <>
      <Layout
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              <Panel title={pageHeading}>{pageSubHeading}</Panel>
              <ApplicationCompleteWhatNext />
              <WarningText>
                <GovUKBody className="govuk-!-font-weight-bold">
                  You can still use your beacon. Search and Rescue will be able
                  to identify and locate you.
                </GovUKBody>
                <GovUKBody className="govuk-!-font-weight-bold">
                  Remember your beacon should only be used in an emergency. If
                  needed, you can also contact HM Coastguard 24/7 on Tel: 020
                  381 72630.
                </GovUKBody>
              </WarningText>
            </>
          }
        />
      </Layout>
    </>
  );
};

const ApplicationCompleteWhatNext: FunctionComponent = (): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">What happens next</h2>
    <GovUKBody>
      We&apos;ve sent your application to register a UK encoded 406MHz beacon to
      The Maritime and Coastguard Beacon Registry office.
    </GovUKBody>
    <GovUKBody>
      They will contact you either to confirm your registration, or to ask for
      more information.
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    const formData: CacheEntry = getCache(context.req.cookies);
    // TODO: State persistence stuff to go her

    return {
      props: { formData },
    };
  }
);

export default ApplicationCompletePage;
