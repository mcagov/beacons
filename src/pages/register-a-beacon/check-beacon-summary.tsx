import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { BreadcrumbList, BreadcrumListItem } from "../../components/Breadcrumb";

import parse from "urlencoded-body-parser";
import { GetServerSideProps } from "next";

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
    <BreadcrumListItem>Home</BreadcrumListItem>
    <BreadcrumListItem>Section</BreadcrumListItem>
    <BreadcrumListItem>Subsection</BreadcrumListItem>
  </BreadcrumbList>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.method === "POST") {
    const previousFormPageData = await parse(context.req);
    return {
      props: previousFormPageData,
    };
  }

  return {
    props: {},
  };
};

export default CheckBeaconDetails;
