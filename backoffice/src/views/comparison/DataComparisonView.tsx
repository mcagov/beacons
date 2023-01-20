import { useAuthContext } from "components/auth/AuthProvider";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { FunctionComponent, useEffect, useState } from "react";

export interface IDataComparison {
  dbCount: number;
  openSearchCount: number;
  missingCount: number;
  missing: IBeaconOverview[];
}

export interface IBeaconOverview {
  id: string;
  hexId: string;
  lastModifiedDate: string;
}
interface BeaconExportRecordsProps {
  exportsGateway: IExportsGateway;
}

export const DataComparisonView: FunctionComponent<
  BeaconExportRecordsProps
> = ({ exportsGateway }): JSX.Element => {
  const [result, setResult] = useState<IDataComparison>({} as IDataComparison);
  useEffect(() => {
    const getResponse = async () => {
      await exportsGateway.getDataComparison().then(setResult);
    };
    getResponse().catch(console.error);
  }, [exportsGateway]);

  return (
    <ul>
      <li>DB Count : {result.dbCount}</li>
      <li>Open Search Count : {result.openSearchCount}</li>
      <li>Open Search Missing Count : {result.missingCount}</li>
      {result.missing && result.missing.length > 0 && (
        <li>Open Search Missing Beacons :</li>
      )}
      {result.missing &&
        result.missing.map((missingBeacon, index) => (
          <li key={index}>
            {missingBeacon.id} | {missingBeacon.hexId} |{" "}
            {missingBeacon.lastModifiedDate}{" "}
          </li>
        ))}
    </ul>
  );
};
