import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../components/layout/PageContent";
import { Certificate } from "../components/Certificate";
import { IExportsGateway } from "../gateways/exports/IExportsGateway";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
  })
);

interface CertificateViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
}

export const CertificateView: FunctionComponent<CertificateViewProps> = ({
  exportsGateway,
  beaconId,
}): JSX.Element => {
  const classes = useStyles();
  const [certificate, setCertificate] = useState({
    coding: "",
    protocol: "",
    createdDate: new Date(),
    mti: "",
    csta: "",
    lastModifiedDate: new Date(),
    svdr: "",
    name: "",
    contactNumber: "",
    hexid: "",
  });

  useEffect(() => {
    getCertificate();
  });

  async function getCertificate(): Promise<void> {
    setCertificate(await exportsGateway.getCertificateDataForBeacon(beaconId));
  }

  if (certificate.coding) {
    return (
      <div className={classes.root}>
        <PageContent>
          <Certificate certificate={certificate} />
        </PageContent>
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        <PageContent>
          <p>No certificate available</p>
        </PageContent>
      </div>
    );
  }
};
