import React, { FunctionComponent } from "react";
import Aside from "../components/Aside";
import { StartButton } from "../components/Button";
import { Grid } from "../components/Grid";
import { InsetText } from "../components/InsetText";
import { Layout } from "../components/Layout";
import { BreadcrumbList, BreadcrumbListItem } from "../components/Breadcrumb";
import { McaLogo } from "../components/Mca";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { setFormSubmissionCookie } from "../lib/middleware";
import { PageHeading } from "../components/Typography";
import { WarningText } from "../components/WarningText";

const ServiceStartPage: FunctionComponent = () => (
  <>
    <Layout navigation={<Breadcrumbs />}>
      <Grid
        mainContent={
          <>
            <PageHeading>
              Register a UK 406 MHz beacon for maritime use
            </PageHeading>
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

const Breadcrumbs: FunctionComponent = () => (
  <BreadcrumbList>
    <BreadcrumbListItem>Home</BreadcrumbListItem>
    <BreadcrumbListItem>Section</BreadcrumbListItem>
    <BreadcrumbListItem>Subsection</BreadcrumbListItem>
  </BreadcrumbList>
);

const AboutTheService: FunctionComponent = () => (
  <>
    <p className="govuk-body">Use this service to:</p>

    <ul className="govuk-list govuk-list--bullet">
      <li>
        Register a new 406 Megahertz (MHz) beacon for use on maritime
        vessels/craft
      </li>
    </ul>

    <p className="govuk-body">Registering takes around 10 minutes.</p>

    <WarningText>
      <>
        You cannot register a beacon for non-maritime use through this service.
        You can use another service to{" "}
        <a
          className="govuk-link"
          href="https://forms.dft.gov.uk/mca-sar-epirb/"
        >
          register a beacon for aircraft or land-based use.
        </a>{" "}
      </>
    </WarningText>

    <h2 className="govuk-heading-m">Before you start</h2>

    <ul className="govuk-list govuk-list--bullet">
      <li>
        You will need to know the beacon HEX ID, manufacturer serial number and
        model
      </li>
      <li>
        If you have a vessel, you will need your vessel name, number, call sign
        and MMSI number
      </li>
      <li>
        You will also need emergency contact details for Search and Rescue
      </li>
    </ul>

    <StartButton href="/register-a-beacon/check-beacon-details" />
  </>
);

const RelatedContent: FunctionComponent = () => (
  <>
    <Aside>
      <McaLogo />
    </Aside>

    <Aside title="Related content">
      <ul className="govuk-list govuk-!-font-size-16">
        <li>
          <a className="govuk-link" href="#">
            Find your beacons HEX ID
          </a>
        </li>
        <li>
          <a className="govuk-link" href="#">
            Emergency and life-saving equipment on ships
          </a>
        </li>
        <li>
          <a className="govuk-link" href="#">
            UK Ship Register
          </a>
        </li>
        <li>
          <a className="govuk-link" href="#">
            Aircraft registrations (G-INFO)
          </a>
        </li>
        <li>
          <a className="govuk-link" href="#">
            Non 406MHz beacons
          </a>
        </li>
        <li>
          <a className="govuk-link" href="#">
            Non UK encoded beacons
          </a>
        </li>
      </ul>
    </Aside>
  </>
);

const OtherWaysToAccessTheService: FunctionComponent = () => (
  <>
    <h2 className="govuk-heading-m">Other ways to apply</h2>

    <p className="govuk-body">
      You can also{" "}
      <a className="govuk-link" href="#">
        register by post
      </a>
      .
    </p>

    <p className="govuk-body">
      Or contact the UK Beacon Registry for help with registering.
    </p>

    <InsetText>
      <>
        <ul className="govuk-list">
          <li className="govuk-!-font-weight-bold">The UK Beacon Registry</li>
          <li>
            <a className="govuk-link" href="mailto:ukbeacons@mcga.gov.uk">
              ukbeacons@mcga.gov.uk
            </a>
          </li>
          <li className="govuk-!-font-weight-bold">Telephone: 01326 211569</li>
          <li className="govuk-!-font-weight-bold">Fax: 01326 319264</li>
          <li className="govuk-!-font-weight-bold">
            Monday to Friday, 9am to 5pm (except public holidays)
          </li>
          <li>
            <a className="govuk-link" href="#">
              Find out about call charges
            </a>
          </li>
        </ul>
      </>
    </InsetText>
  </>
);

const DataProtection: FunctionComponent = () => (
  <>
    <h2 className="govuk-heading-m">Data protection regulations</h2>

    <p className="govuk-body">
      The Maritime and Coastguard Agency (MCA) collect and retain the personal
      information provided when you register a UK coded 406 MHz beacon.
      Processing your information allows the MCA to exercise its official duty
      and to identify persons in distress and helps save lives.
    </p>

    <p className="govuk-body">
      We will retain your information until we are advised that the beacon is no
      longer active, for example it has been removed from the vessel, replaced
      or destroyed.
    </p>

    <p className="govuk-body">
      We will share your information with Global Search &amp; Rescue authorities
      and those delegated authorities, such as RNLI Lifeboats, Police or Rescue
      Helicopter crew, that are directly involved with investigations relating
      to a beacon activation.
    </p>

    <p className="govuk-body">
      Further details on Beacon Registration’s privacy policy can be found at{" "}
      <a
        className="govuk-link"
        href="https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice"
      >
        https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice
      </a>
    </p>

    <p className="govuk-body">
      To find out more about how the MCA looks after personal data, your rights,
      and how to contact our data protection officer, please go to{" "}
      <a
        className="govuk-link"
        href="https://www.gov.uk/government/organisations/maritime-and-coastguard-agency/about/personal-information-charter"
      >
        www.gov.uk/mca/privacy-policy
      </a>
    </p>
  </>
);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  setFormSubmissionCookie(context);

  return { props: {} };
};

export default ServiceStartPage;
