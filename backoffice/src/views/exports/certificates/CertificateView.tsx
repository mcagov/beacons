import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { IBeaconExport } from "gateways/exports/IBeaconExport";
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
  const [beacon, setBeacon] = useState<IBeaconExport>({} as IBeaconExport);

  useEffect(() => {
    exportsGateway.getCertificateDataForBeacon(beaconId).then(setBeacon);
  }, [beaconId, exportsGateway]);

  switch (beacon.type) {
    case "Legacy":
      return <LegacyCertificate beacon={beacon} />;
    case "New":
      return <Certificate beacon={beacon} />;
    default:
      return (
        <div>
          <p>No beacon available</p>
        </div>
      );
  }
};
