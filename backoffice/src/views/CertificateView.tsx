import { FunctionComponent, useEffect, useState } from "react";
import { Certificate } from "../components/certificates/Certificate2";
import { IExportsGateway } from "../gateways/exports/IExportsGateway";
import { ICertificate } from "gateways/exports/ICertificate";

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
    async function getCertificate(): Promise<void> {
      const certData = await exportsGateway.getCertificateDataForBeacon(
        beaconId
      );
      setCertificate(certData);
    }

    getCertificate();
  }, [beaconId, exportsGateway]);

  if (certificate.beacon) {
    return <Certificate certificate={certificate} />;
  } else {
    return (
      <div>
        <p>No certificate available</p>
      </div>
    );
  }
};
