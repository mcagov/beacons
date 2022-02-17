import React, { FunctionComponent } from "react";
import { AccountPageURLs } from "../../lib/urls";
import { LinkButton } from "../Button";

export const ReturnToYourAccountSection: FunctionComponent =
  (): JSX.Element => (
    <>
      {/*<SectionHeading>Your Beacon Registry Account</SectionHeading>*/}
      <LinkButton
        buttonText="Return to your Beacon Registry Account"
        href={AccountPageURLs.accountHome}
      />
    </>
  );
