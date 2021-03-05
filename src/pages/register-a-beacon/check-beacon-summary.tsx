import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { NotificationBannerSuccess } from "../../components/NotificationBanner";
import { FormJSON } from "../../lib/form/formManager";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps } from "../../lib/handlePageRequest";
import {
  getCache,
  parseFormData,
  updateFormCache,
  withCookieRedirect,
} from "../../lib/middleware";

interface BeaconDetailsSummaryProps {
  form: FormJSON;
  heading: string;
}

const CheckBeaconSummaryPage: FunctionComponent<FormPageProps> = ({
  form,
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
        TODO: will be updated in Stuart Mindt's PR
      </Layout>
    </>
  );
};

const BeaconNotRegisteredView: FunctionComponent<BeaconDetailsSummaryProps> = (
  props
): JSX.Element => {
  return (
    <>
      <NotificationBannerSuccess title="Beacon details checked">
        <div>
          This beacon is a valid 406MHz UK encoded beacon that has not been
          registered before.
        </div>
        <div>
          You can now enter the remaining beacon information necessary to
          register.
        </div>
      </NotificationBannerSuccess>

      <LinkButton
        buttonText={"Continue"}
        href={"/register-a-beacon/check-your-answers"}
      />
      <IfYouNeedHelp />
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
