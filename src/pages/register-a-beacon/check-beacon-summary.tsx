import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import {
  BreadcrumbList,
  BreadcrumbListItem,
} from "../../components/Breadcrumb";

import parse from "urlencoded-body-parser";
import { GetServerSideProps } from "next";
import { IFormCache, FormCacheFactory } from "../../lib/form-cache";

interface CheckBeaconDetailsProps {
  beaconManufacturer: string;
  beaconModel: string;
  beaconHexId: string;
}

const CheckBeaconDetails: FunctionComponent<CheckBeaconDetailsProps> = ({
  beaconManufacturer,
  beaconModel,
  beaconHexId,
}: CheckBeaconDetailsProps): JSX.Element => {
  return (
    <>
      <Layout breadcrumbs={<Breadcrumbs />}>
        <Grid
          mainContent={
            <>
              <p>{beaconManufacturer}</p>
              <p>{beaconModel}</p>
              <p>{beaconHexId}</p>
            </>
          }
        />
      </Layout>
    </>
  );
};

const Breadcrumbs: FunctionComponent = () => (
  <BreadcrumbList>
    <BreadcrumbListItem>Home</BreadcrumbListItem>
    <BreadcrumbListItem>Section</BreadcrumbListItem>
    <BreadcrumbListItem>Subsection</BreadcrumbListItem>
  </BreadcrumbList>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.method === "POST") {
    const previousFormPageData: CheckBeaconDetailsProps = await parse(
      context.req
    );

    const state: IFormCache = FormCacheFactory.getState();
    state.set("id", previousFormPageData);

    return {
      props: previousFormPageData,
    };
  } else if (context.req.method === "GET") {
    const state: IFormCache = FormCacheFactory.getState();
    const existingState = state.get("id");

    return { props: existingState };
  }

  return {
    props: {},
  };
};

export default CheckBeaconDetails;
