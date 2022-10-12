import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { IBeaconExport } from "gateways/exports/IBeaconExport";
import { LegacyCertificate } from "views/exports/certificates/LegacyCertificate";
import { Certificate } from "./Certificate";
import { IBeacon } from "../../../entities/IBeacon";

interface CertificateViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
}

interface CertificatesViewProps {
  exportsGateway: IExportsGateway;
  beaconIds: string[];
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

export const CertificatesView: FunctionComponent<CertificatesViewProps> = ({
  exportsGateway,
  beaconIds,
}): JSX.Element => {
  const [beacons, setBeacons] = useState<IBeaconExport[]>(
    [] as IBeaconExport[]
  );

  useEffect(() => {
    exportsGateway.getCertificateDataForBeacons(beaconIds).then(setBeacons);
  }, [beaconIds, exportsGateway]);

  return (
    <div>
      {beacons.map((beacon: IBeaconExport, index) => (
        <div key={index}>
          {isType(beacon, "LEGACY") && <LegacyCertificate beacon={beacon} />}
          {isType(beacon, "New") && <Certificate beacon={beacon} />}
        </div>
      ))}
    </div>
  );

  function isType(beacon: IBeaconExport, type: string) {
    return beacon.type === type;
  }
};
