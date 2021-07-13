import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../Button";
import { Grid } from "../Grid";
import { Layout } from "../Layout";
import { GovUKBody, PageHeading } from "../Typography";

interface ConfirmAnActionProps {
  actionText: string;
  consequencesText?: string;
  redirectUriIfYes: string;
  redirectUriIfCancel: string;
}

export const ConfirmAnAction: FunctionComponent<ConfirmAnActionProps> = ({
  actionText,
  consequencesText,
  redirectUriIfYes,
  redirectUriIfCancel,
}: ConfirmAnActionProps): JSX.Element => {
  const pageHeading = "Are you sure you want to " + actionText + "?";
  return (
    <Layout
      navigation={<BackButton href={redirectUriIfCancel} />}
      title={pageHeading}
    >
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>

            <GovUKBody>{consequencesText}</GovUKBody>

            <LinkButton buttonText="Cancel" href={redirectUriIfCancel} />

            <LinkButton buttonText="Yes" href={redirectUriIfYes} />
          </>
        }
      />
    </Layout>
  );
};
