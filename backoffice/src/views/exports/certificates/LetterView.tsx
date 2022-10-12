import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { IBeaconExport } from "gateways/exports/IBeaconExport";
import { CoverLetter } from "views/exports/letters/CoverLetter";

interface LetterViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
}
interface LettersViewProps {
  exportsGateway: IExportsGateway;
  beaconIds: string[];
}

export const LetterView: FunctionComponent<LetterViewProps> = ({
  exportsGateway,
  beaconId,
}): JSX.Element => {
  const [beacon, setBeacon] = useState<IBeaconExport>({} as IBeaconExport);

  useEffect(() => {
    exportsGateway.getLetterDataForBeacon(beaconId).then(setBeacon);
  }, [beaconId, exportsGateway]);

  return (
    <div>
      <CoverLetter beacon={beacon} type="Registration" />
      <CoverLetter beacon={beacon} type="Amended" />
    </div>
  );
};

export const LettersView: FunctionComponent<LettersViewProps> = ({
  exportsGateway,
  beaconIds,
}): JSX.Element => {
  const [beacons, setBeacons] = useState<IBeaconExport[]>(
    [] as IBeaconExport[]
  );

  useEffect(() => {
    exportsGateway.getLetterDataForBeacons(beaconIds).then(setBeacons);
  }, [beaconIds, exportsGateway]);

  return (
    <div>
      {beacons.map((beacon: IBeaconExport, index) => (
        <div key={index}>
          <CoverLetter beacon={beacon} type="Registration" />
          <CoverLetter beacon={beacon} type="Amended" />
        </div>
      ))}
    </div>
  );
};
