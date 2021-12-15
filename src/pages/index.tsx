import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import Aside from "../components/Aside";
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
import { BeaconsGetServerSidePropsContext } from "../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../lib/middleware/withContainer";
import { acceptRejectCookieId } from "../lib/types";
import { AccountPageURLs } from "../lib/urls";
import { BeaconsPageRouter } from "../router/BeaconsPageRouter";
import { Rule } from "../router/rules/Rule";

interface ServiceStartPageProps {
  showCookieBanner: boolean;
}

const ServiceStartPage: FunctionComponent<ServiceStartPageProps> = ({
  showCookieBanner,
}: ServiceStartPageProps): JSX.Element => {
  const pageHeading = "Register a UK 406 megahertz (MHz) beacon";

  return (
    <>
      <Layout title={pageHeading} showCookieBanner={showCookieBanner}>
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

const AboutTheService: FunctionComponent = (): JSX.Element => (
  <>
    <GovUKBody>
      A UK 406 MHz beacon sends a distress signal to alert search and rescue
      authorities to your location.
    </GovUKBody>

    <GovUKBody>Use this service to:</GovUKBody>

    <GovUKBulletedList>
      <li>register a UK 406 MHz beacon</li>
      <li>update your beacon registration details</li>
      <li>update your vessel or aircraft details</li>
    </GovUKBulletedList>

    <GovUKBody>
      You can register the following types of UK 406 MHz beacon:
    </GovUKBody>

    <GovUKBulletedList>
      <li>Personal Locator Beacon (PLB), for any use</li>
      <li>
        Emergency Position Indicating Radio Beacon (EPIRB) or Simplified
        Voyage-Data Recorder, for maritime use
      </li>
      <li>
        Emergency Locator Transmitter (ELT) or ELT dongle, for aircraft use
      </li>
    </GovUKBulletedList>

    <GovUKBody>Registering is free and takes around 15 minutes.</GovUKBody>

    <StartButton href={AccountPageURLs.signUpOrSignIn} />

    {/* <InsetText>
      If you want to register multiple beacons (i.e. more than 5),&nbsp;
      <AnchorLink href="mailto:ukbeacons@mcga.gov.uk">
        contact the UK Beacon Registry
      </AnchorLink>{" "}
      who will provide you with a spreadsheet template
    </InsetText> */}

    <SectionHeading>Before you start</SectionHeading>
    <GovUKBody>You’ll need:</GovUKBody>
    <GovUKBulletedList>
      <li>
        the beacon Hexadecimal Identification (HEX ID) or Unique Identifying
        Number (UIN), manufacturer serial number and model
      </li>
      <li>an emergency contact for search and rescue authorities</li>
      <li>
        if you have a vessel - your vessel name, number, call sign, Maritime
        Mobile Service Identity (MMSI) number, and details of the radio
        communications equipment you use
      </li>
      <li>
        if you have an aircraft - your aircraft make, model, registration mark,
        and details of the radio communications equipment you use
      </li>
    </GovUKBulletedList>
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

    <GovUKBody>Contact the UK Beacon Registry team to:</GovUKBody>
    <GovUKBulletedList>
      <li>get help registering online</li>
      <li>register multiple beacons at once</li>
      <li>register by post</li>
    </GovUKBulletedList>

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
        406 MHz beacons privacy information notice
      </AnchorLink>
      .
    </GovUKBody>

    <GovUKBody>
      To find out more about how the MCA looks after personal data, your rights,
      and how to contact our data protection officer, please go to{" "}
      <AnchorLink href="https://www.gov.uk/mca/privacy-policy">
        personal information charter
      </AnchorLink>
      .
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserViewedIndexPage(context),
    ]).execute();
  }
);

class IfUserViewedIndexPage implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return {
      props: {
        showCookieBanner: !this.context.req.cookies[acceptRejectCookieId],
      },
    };
  }
}

export default ServiceStartPage;
