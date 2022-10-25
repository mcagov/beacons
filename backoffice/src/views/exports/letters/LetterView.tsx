import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { IBeaconExport } from "gateways/exports/IBeaconExport";
import { CoverLetter } from "views/exports/letters/CoverLetter";

interface LetterViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
  letterType: string;
}

export const LetterView: FunctionComponent<LetterViewProps> = ({
  exportsGateway,
  beaconId,
  letterType,
}): JSX.Element => {
  const [beacon, setBeacon] = useState<IBeaconExport>({} as IBeaconExport);
  useEffect(() => {
    exportsGateway.getLetterDataForBeacon(beaconId).then(setBeacon);
  }, [beaconId, exportsGateway]);
  return (
    <div onLoad={window.print}>
      {letterType === "registration" && (
        <CoverLetter beacon={beacon} type="Registration" />
      )}
      {letterType === "amended" && (
        <CoverLetter beacon={beacon} type="Amended" />
      )}
    </div>
  );
};
