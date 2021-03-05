import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BackButton } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps } from "../../lib/handlePageRequest";
import {
  getCache,
  parseFormData,
  updateFormCache,
  withCookieRedirect,
} from "../../lib/middleware";

const CheckBeaconSummaryPage: FunctionComponent<FormPageProps> = ({
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Beacon details checked";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/check-beacon-details" />
        }
        title={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        TODO: will be removed in Check Answers Summary PR
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    if (context.req.method === "POST") {
      const formData: CacheEntry = await parseFormData(context.req);
      updateFormCache(context.req.cookies, formData);

      return {
        props: { ...formData },
      };
    } else if (context.req.method === "GET") {
      const existingState: CacheEntry = getCache(context.req.cookies);

      return { props: { ...existingState } };
    }

    return {
      props: {},
    };
  }
);

export default CheckBeaconSummaryPage;
