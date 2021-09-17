import React, { FunctionComponent } from "react";
import { ReturnToYourAccountSection } from "../../components/domain/ReturnToYourAccountSection";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Panel } from "../../components/Panel";
import { GovUKBody, SectionHeading } from "../../components/Typography";
import styles from "../../styles/delete-panel.module.scss";

const Success: FunctionComponent = (): JSX.Element => {
  const pageHeading = "Feedback submitted";

  return (
    <>
      <Layout
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              <Panel title={pageHeading} classes={styles.success}>
                Thank you for submitting your feedback.
              </Panel>
              <SectionHeading>What happens next</SectionHeading>
              <GovUKBody>
                We will use your feedback to improve our service.
              </GovUKBody>
              <ReturnToYourAccountSection />
            </>
          }
        />
      </Layout>
    </>
  );
};

export default Success;
