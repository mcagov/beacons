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
  SectionHeading,
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
    "Register a UK 406MHz Beacon for commercial or pleasure use";

  return (
    <>
      <Layout
        navigation={<Breadcrumbs />}
        title={pageHeading}
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
    <GovUKBody>
      You can use this service to register any of the following types of UK 406
      Megahertz (MHz) emergency beacons:
    </GovUKBody>

    <GovUKBulletedList>
      <li>a Personal Locator Beacon (PLB) for any use</li>
      <li>
        an Emergency Position Indicating Radio Beacon (EPIRB) for maritime use
      </li>
      <li>an Emergency Locator Transmitter (ELT) for aircraft use</li>
      <li>a Beacon dongle for aircraft use</li>
    </GovUKBulletedList>

    <GovUKBody>Registering takes around 15 minutes.</GovUKBody>

    <InsetText>
      If you want to register multiple beacons (i.e. more than 5),&nbsp;
      <AnchorLink href="mailto:ukbeacons@mcga.gov.uk">
        contact the UK Beacon Registry
      </AnchorLink>{" "}
      who will provide you with a spreadsheet template
    </InsetText>

    <SectionHeading>Before you start</SectionHeading>

    <GovUKBulletedList>
      <li>
        You&apos;ll need to know the beacon Hexadecimal Identification (HEX ID)
        or Unique Identifying Number (UIN), manufacturer serial number and model
      </li>
      <li>
        If you have a vessel, you will need your vessel name, number(s), radio
        communications, Call Sign and Maritime Mobile Service Identity (MMSI)
        number
      </li>
      <li>
        If you have an aircraft, you will need your aircraft make and model,
        Aircraft Registration Mark, aircraft number(s), radio communcations
      </li>
      <li>
        You will also need at least one emergency contact for Search and Rescue
      </li>
    </GovUKBulletedList>

    <GovUKBody>
      You can{" "}
      <AnchorLink href="mailto:ukbeacons@mcga.gov.uk">
        contact the UK Beacon Registry
      </AnchorLink>{" "}
      if you aren{"'"}t sure if your beacon is 406MHz or not.
    </GovUKBody>

    <WarningText>
      <>
        This service is only for UK programmed 406MHz beacons.&nbsp;
        <AnchorLink href="mailto:ukbeacons@mcga.gov.uk">
          Contact the UK Beacon Registry
        </AnchorLink>
        &nbsp;if you aren&apos;t sure if your beacon is 406MHz or not.
      </>
    </WarningText>

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
    <SectionHeading>Other ways to apply</SectionHeading>

    <GovUKBody>
      If you need help with registering online, want to register multiple
      beacons at once or would like to register by post, contact the UK Beacon
      Registry team.
    </GovUKBody>

    <InsetText>
      <BeaconRegistryContactInfo />
    </InsetText>
  </>
);

const DataProtection: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Data protection regulations</SectionHeading>

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
