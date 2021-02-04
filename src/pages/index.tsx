import React, { FunctionComponent } from "react";
import Aside from "../components/Aside";
import { StartButton } from "../components/Button";
import { Grid } from "../components/Grid";
import { InsetText } from "../components/InsetText";
import { Layout } from "../components/Layout";
import { BreadcrumbList, BreadcrumListItem } from "../components/Breadcrumb";

const ServiceStartPage: FunctionComponent = () => (
  <>
    <Layout breadcrumbs={<Breadcrumbs />}>
      <Grid
        mainContent={
          <>
            <PageHeading />
            <AboutTheService />
            <OtherWaysToAccessTheService />
          </>
        }
        aside={<RelatedContent />}
      />
    </Layout>
  </>
);

const Breadcrumbs: FunctionComponent = () => (
  <BreadcrumbList>
    <BreadcrumListItem>Home</BreadcrumListItem>
    <BreadcrumListItem>Section</BreadcrumListItem>
    <BreadcrumListItem>Subsection</BreadcrumListItem>
  </BreadcrumbList>
);

const PageHeading: FunctionComponent = () => (
  <h1 className="govuk-heading-l">Register a UK 406 MHz beacon</h1>
);

const AboutTheService: FunctionComponent = () => (
  <>
    <p className="govuk-body">Use this service to:</p>

    <ul className="govuk-list govuk-list--bullet">
      <li>Register a new 406 Megahertz (MHz) beacon</li>
      <li>Update your name, address or other details</li>
      <li>Tell us about a change in beacon ownership</li>
      <li>Inform us of a beacon disposal</li>
    </ul>

    <p className="govuk-body">Registering takes around 5 minutes.</p>

    <InsetText>
      <>
        This service is only for UK encoded 406MHz beacons. You can{" "}
        <a className="govuk-link" href="#">
          contact the UK Beacon Registry
        </a>{" "}
        if you are not sure if your beacon is 406MHz or not.
      </>
    </InsetText>

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
        If you have an aircraft, you will need the aircraft registration mark,
        manufacturer and type and 24 bit HEX
      </li>
      <li>
        You will also need emergency contact details for Search and Rescue
      </li>
    </ul>

    <StartButton />
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

const RelatedContent: FunctionComponent = () => (
  <>
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

export default ServiceStartPage;
