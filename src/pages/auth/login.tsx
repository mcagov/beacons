import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { PageHeading } from "../../components/Typography";

const LoginPage: FunctionComponent = (): JSX.Element => {
  const pageHeading = "Sign In using my Beacon Registry Account";

  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <Grid mainContent={<PageHeading>{pageHeading}</PageHeading>} />
      <div id="api"></div>
      <IfYouNeedHelp />
    </Layout>
  );
};

export default LoginPage;
