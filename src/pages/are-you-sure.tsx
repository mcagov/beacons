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

export const getServersideProps: GetServerSideProps = async (context) => {
  const { action, consequences, yes, no } = context.query;
  return {
    props: {
      actionText: action,
      consequencesText: consequences,
      redirectUriIfYes: yes,
      redirectUriIfNo: no,
    },
  };
};

export default AreYouSure;
