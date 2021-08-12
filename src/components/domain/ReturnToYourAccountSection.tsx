import React, { FunctionComponent } from "react";
import { PageURLs } from "../../lib/urls";
import { LinkButton } from "../Button";
import { SectionHeading } from "../Typography";

export const ReturnToYourAccountSection: FunctionComponent =
  (): JSX.Element => (
    <>
      <SectionHeading>Your Beacon Registry Account</SectionHeading>
      <LinkButton
        buttonText="Return to your Account"
        href={PageURLs.accountHome}
      />
    </>
  );
