import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { IBeaconExport } from "gateways/exports/IBeaconExport";
import { CoverLetter } from "views/exports/letters/CoverLetter";

interface LetterViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
  letterType: string;
}

interface LettersViewProps {
  exportsGateway: IExportsGateway;
  beaconIds: string[];
  lettersType: string;
}

export const LetterView: FunctionComponent<LetterViewProps> = ({
  exportsGateway,
  beaconId,
  letterType,
}): JSX.Element => {
  console.log(beaconId);
  const [beacon, setBeacon] = useState<IBeaconExport>({} as IBeaconExport);
  useEffect(() => {
    exportsGateway.getLetterDataForBeacon(beaconId).then(setBeacon);
  }, [beaconId, exportsGateway]);
  return (
    <div>
      {letterType === "registration" && (
        <CoverLetter beacon={beacon} type="Registration" />
      )}
      {letterType === "amended" && (
        <CoverLetter beacon={beacon} type="Amended" />
      )}
    </div>
  );
};

export const LettersView: FunctionComponent<LettersViewProps> = ({
  exportsGateway,
  beaconIds,
  lettersType,
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
          {lettersType === "registration" && (
            <CoverLetter beacon={beacon} type="Registration" />
          )}
          {lettersType === "amended" && (
            <CoverLetter beacon={beacon} type="Amended" />
          )}
        </div>
      ))}
    </div>
  );
};
