import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import Aside from "../components/Aside";
import { BreadcrumbList, BreadcrumbListItem } from "../components/Breadcrumb";
import { StartButton } from "../components/Button";
import { Grid } from "../components/Grid";
import { InsetText } from "../components/InsetText";
import { Layout } from "../components/Layout";
import { BeaconRegistryContactInfo, McaLogo } from "../components/Mca";
import {
  AnchorLink,
  GovUKBody,
  GovUKBulletedList,
  PageHeading,
} from "../components/Typography";
import { WarningText } from "../components/WarningText";
import { setFormSubmissionCookie } from "../lib/middleware";
import { acceptRejectCookieId } from "../lib/types";

interface ServiceStartPageProps {
  showCookieBanner: boolean;
}

const ServiceStartPage: FunctionComponent<ServiceStartPageProps> = ({
  showCookieBanner,
}: ServiceStartPageProps): JSX.Element => {
  const pageHeading =
    "Register a single UK 406MHz Personal Locator Beacon (PLB) for maritime use";

  return (
    <>
      <Layout
        navigation={<Breadcrumbs />}
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <AboutTheService />
              <OtherWaysToAccessTheService />
              <DataProtection />
            </>
          }
          aside={<RelatedContent />}
        />
      </Layout>
    </>
  );
};

const Breadcrumbs: FunctionComponent = (): JSX.Element => (
  <BreadcrumbList>
    <BreadcrumbListItem>Home</BreadcrumbListItem>
    <BreadcrumbListItem>Section</BreadcrumbListItem>
    <BreadcrumbListItem>Subsection</BreadcrumbListItem>
  </BreadcrumbList>
);

const AboutTheService: FunctionComponent = (): JSX.Element => (
  <>
    <GovUKBody>Use this service to:</GovUKBody>

    <GovUKBulletedList>
      <li>
        Register a single new 406 Megahertz (MHz) Personal Locator Beacon (PLB)
        for use on maritime vessels
      </li>
    </GovUKBulletedList>

    <GovUKBody>Registering takes around 10 minutes.</GovUKBody>

    <GovUKBody>
      This service is only for UK programmed 406MHz beacons. You can{" "}
      <AnchorLink href="mailto:ukbeacons@mcga.gov.uk">
        contact the UK Beacon Registry
      </AnchorLink>{" "}
      if you aren{"'"}t sure if your beacon is 406MHz or not.
    </GovUKBody>

    <WarningText>
      <>
        You cannot register a beacon for non-maritime use through this service.
        You can use another service to{" "}
        <AnchorLink href="https://forms.dft.gov.uk/mca-sar-epirb/">
          register a beacon for aircraft or land-based use.
        </AnchorLink>
      </>
    </WarningText>

    <h2 className="govuk-heading-m">Before you start</h2>

    <GovUKBulletedList>
      <li>
        You{"'"}ll need to know the beacon Hexadecimal Identification (HEX ID)
        or Unique Identifying Number (UIN), manufacturer serial number and model
      </li>
      <li>
        If you have a vessel, you will need your vessel name, number, radio
        communications, Call Sign and Maritime Mobile Service Identity (MMSI)
        number
      </li>
      <li>
        You will also need at least one emergency contact for Search and Rescue
      </li>
    </GovUKBulletedList>

    <StartButton href="/register-a-beacon/check-beacon-details" />
  </>
);

const RelatedContent: FunctionComponent = (): JSX.Element => (
  <>
    <Aside>
      <McaLogo />
    </Aside>
  </>
);

const OtherWaysToAccessTheService: FunctionComponent = (): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">Other ways to apply</h2>

    <GovUKBody>
      If you need help with registering online or would like to register by
      post, contact the UK Beacon Registry team.
    </GovUKBody>

    <InsetText>
      <BeaconRegistryContactInfo />
    </InsetText>
  </>
);

const DataProtection: FunctionComponent = (): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">Data protection regulations</h2>

    <GovUKBody>
      The Maritime {"&"} Coastguard Agency (MCA) collect and retain the personal
      information provided when you register a UK programmed 406 MHz beacon.
      Processing your information allows the MCA to exercise its official duty
      and to identify persons in distress and helps save lives.
    </GovUKBody>

    <GovUKBody>
      We will retain your information until we are advised that the beacon is no
      longer active, for example it has been removed from the vessel, replaced
      or destroyed.
    </GovUKBody>

    <GovUKBody>
      We will share your information with global Search and Rescue authorities
      and those delegated authorities, such as RNLI, Police or Rescue helicopter
      crew, that are directly involved with investigations relating to a beacon
      activation.
    </GovUKBody>

    <GovUKBody>
      Further details on Beacon Registration privacy policy can be found at{" "}
      <AnchorLink href="https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice">
        https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice
      </AnchorLink>
    </GovUKBody>

    <GovUKBody>
      To find out more about how the MCA looks after personal data, your rights,
      and how to contact our data protection officer, please go to{" "}
      <AnchorLink href="https://www.gov.uk/mca/privacy-policy">
        www.gov.uk/mca/privacy-policy
      </AnchorLink>
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  setFormSubmissionCookie(context);
  const showCookieBanner = !context.req.cookies[acceptRejectCookieId];

  return { props: { showCookieBanner } };
};

export default ServiceStartPage;
