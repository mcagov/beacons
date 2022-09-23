import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../components/layout/PageContent";
import { Certificate } from "../components/Certificate";
import { IExportsGateway } from "../gateways/exports/IExportsGateway";
import { ICertificate } from "gateways/exports/ICertificate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "white",
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
  const [certificate, setCertificate] = useState<ICertificate>(
    {} as ICertificate
  );

  useEffect(() => {
    async function getCertificate(): Promise<void> {
      const certData = await exportsGateway.getCertificateDataForBeacon(
        beaconId
      );
      setCertificate(certData);
    }

    getCertificate();
  }, [beaconId, exportsGateway]);

  if (certificate.beacon) {
    return (
      <div className={classes.root}>
        <PageContent>
          <Certificate certificate={certificate} />
          <div className="footerContainer">
            <div className="footer">
              <span className="title">
                In an Emergency, call Falmouth Coastguard, 24 hour Tel: +44
                (0)1326 317575
              </span>
              <p>
                Proof of Registration from The UK Distress and Security Beacon
                Registry
                <br />
                Falmouth MRCC, Castle Drive, Pendennis Point, Falmouth, Cornwall
                TR11 4WZ
                <br />
                Office Hours Tel: +44 (0)1326 211569 Fax: +44 (0)1326 319264
                <br />
                Email:
                <a className="link" href="mailto:UKBeacons@mcga.gov.uk">
                  UKBeacons@mcga.gov.uk{" "}
                </a>
                <a className="link" href="http://www.gov.uk/406beacon">
                  {" "}
                  http://www.gov.uk/406beacon
                </a>
              </p>
              <div>OFFICIAL</div>
            </div>
          </div>
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
