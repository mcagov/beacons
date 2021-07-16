import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../components/Button";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { GovUKBody, PageHeading } from "../components/Typography";

interface AreYouSureProps {
  actionText: string;
  redirectUriIfYes: string;
  redirectUriIfCancel: string;
  consequencesText?: string;
}

export const AreYouSure: FunctionComponent<AreYouSureProps> = ({
  actionText,
  consequencesText,
  redirectUriIfYes,
  redirectUriIfCancel,
}: AreYouSureProps): JSX.Element => {
  const pageHeading = "Are you sure you want to " + actionText + "?";
  return (
    <Layout
      navigation={<BackButton href={redirectUriIfCancel} />}
      title={pageHeading}
      showCookieBanner={false}
    >
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>

            <GovUKBody>{consequencesText}</GovUKBody>

            <LinkButton
              buttonText="Cancel"
              href={redirectUriIfCancel}
              classes="govuk-button--secondary"
            />
            <br />
            <br />
            <LinkButton buttonText="Yes" href={redirectUriIfYes} />
          </>
        }
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { action, consequences, yes, no } = context.query;

  const props: AreYouSureProps = {
    actionText: action as string,
    consequencesText: (consequences as string) || null,
    redirectUriIfYes: yes as string,
    redirectUriIfCancel: no as string,
  };

  return {
    props,
  };
};

export default AreYouSure;
