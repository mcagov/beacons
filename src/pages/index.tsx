import React, { FunctionComponent } from "react";

const Home: FunctionComponent = () => {
  return (
    <div className={"govuk-width-container"}>
      <main className={"govuk-main-wrapper"}>
        <h1 className="govuk-heading-l">Beacon registration service</h1>

        <p className="govuk-body">Use this service to:</p>

        <ul className="govuk-list govuk-list--bullet">
          <li>
            <a href={"https://github.com/madetech/mca-beacons-webapp/actions"}>
              showcase
            </a>{" "}
            your{" "}
            <a href={"https://github.com/madetech/mca-beacons-integration"}>
              continuous integration
            </a>{" "}
            and{" "}
            <a href={"https://console.aws.amazon.com"}>deployment pipeline</a>
          </li>
          <li>
            talk about reusable{" "}
            <a href={"https://design-system.service.gov.uk/"}>
              GOV.UK design system
            </a>{" "}
            components that will speed up future sprints
          </li>
          <li>
            outline the{" "}
            <a href={"https://miro.com/app/board/o9J_lZRBWY4=/"}>data model</a>{" "}
            as we currently understand it
          </li>
        </ul>
        <a
          href="#"
          role="button"
          draggable="false"
          className="govuk-button govuk-!-margin-top-2 govuk-!-margin-bottom-8 govuk-button--start"
          data-module="govuk-button"
        >
          Start now
          <svg
            className="govuk-button__start-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="17.5"
            height="19"
            viewBox="0 0 33 40"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </a>
      </main>
    </div>
  );
};

export default Home;
