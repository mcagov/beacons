import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
// import { BeaconsForm } from "../../components/BeaconsForm";
// import { FormGroup } from "../../components/Form";
// import { RadioList, RadioListItem } from "../../components/RadioList";
// import { GovUKBody } from "../../components/Typography";
// import { FieldManager } from "../../lib/form/fieldManager";
// import { FormManager } from "../../lib/form/formManager";
// import { Validators } from "../../lib/form/validators";
import {
  // DestinationIfValidCallback,
  FormPageProps,
} from "../../lib/handlePageRequest";

interface YourBeaconRegistyAccountPageProps {}

export const YourBeaconRegistyAccount: FunctionComponent<YourBeaconRegistyAccountPageProps> =
  ({}: // form,
  // showCookieBanner,
  FormPageProps): JSX.Element => {
    const pageHeading = "Your Beacon Registy Account";

    return (
      <Layout title={pageHeading} showCookieBanner={false}>
        <Grid mainContent={<></>} />
      </Layout>
    );
  };

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

export default YourBeaconRegistyAccount;
