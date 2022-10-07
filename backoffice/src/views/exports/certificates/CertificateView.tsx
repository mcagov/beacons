import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { ICertificate } from "gateways/exports/ICertificate";
import { CoverLetter } from "views/exports/letters/CoverLetter";
import { LegacyCertificate } from "views/exports/certificates/LegacyCertificate";
import { Certificate } from "./Certificate";

interface CertificateViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
}

export const CertificateView: FunctionComponent<CertificateViewProps> = ({
  exportsGateway,
  beaconId,
}): JSX.Element => {
  const [certificate, setCertificate] = useState<ICertificate>(
    {} as ICertificate
  );

  useEffect(() => {
    exportsGateway.getCertificateDataForBeacon(beaconId).then(setCertificate);
  }, [beaconId, exportsGateway]);

  switch (certificate.type) {
    case "Legacy":
      return <LegacyCertificate certificate={certificate} />;
    case "New":
      return <Certificate certificate={certificate} />;
    default:
      return (
        <div>
          <p>No certificate available</p>
        </div>
      );
  }
};

export const LetterView: FunctionComponent<CertificateViewProps> = ({
  exportsGateway,
  beaconId,
}): JSX.Element => {
  const [certificate, setCertificate] = useState<ICertificate>(
    {} as ICertificate
  );

  useEffect(() => {
    exportsGateway.getCertificateDataForBeacon(beaconId).then(setCertificate);
  }, [beaconId, exportsGateway]);

  return <CoverLetter certificate={certificate} />;
};
