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
      </main>
    </div>
  );
};

export default Home;
