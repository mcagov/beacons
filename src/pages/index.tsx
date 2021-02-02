import React, { FunctionComponent } from "react";
import Head from "next/head";

const Home: FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Beacon Registration Service - Register a new beacon</title>
      </Head>
      <h1 className="govuk-heading-l">Beacon registration service</h1>

      <p className="govuk-body">Use this service to:</p>

      <ul className="govuk-list govuk-list--bullet">
        <li>
          <a
            href={"https://github.com/madetech/mca-beacons-webapp/actions"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            showcase
          </a>{" "}
          your{" "}
          <a
            href={"https://github.com/madetech/mca-beacons-integration/actions"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            continuous integration and deployment pipeline
          </a>
        </li>
        <li>
          talk about reusable{" "}
          <a
            href={"https://design-system.service.gov.uk/"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            GOV.UK design system
          </a>{" "}
          components that will speed up future sprints
        </li>
        <li>
          outline the{" "}
          <a
            href={"https://miro.com/app/board/o9J_lZRBWY4=/"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            data model
          </a>{" "}
          as we currently understand it
        </li>
      </ul>
      <div className="govuk-panel govuk-panel--confirmation">
        <h1 className="govuk-panel__title">
          Thank you for coming to our
          <br />
          Show and Tell
        </h1>
        <div className="govuk-panel__body">🤗</div>
      </div>
    </>
  );
};

export default Home;
