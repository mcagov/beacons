import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { FunctionComponent, useEffect, useState } from "react";
import {
  ReactiveList,
  DataSearch,
  ReactiveBase,
} from "@appbaseio/reactivesearch";
import { searchUrl } from "../../utils/urls";
import {
  BeaconSearchItem,
  parseBeaconSearchItem,
} from "../../entities/BeaconSearch";
import { Alert, Box } from "@mui/material";

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
    <div>
      <ul>
        <li>DB Count : {result.dbCount}</li>
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
      <ReactiveBase
        app="beacon_search"
        url={searchUrl(window.location.hostname)}
        enableAppbase={false}
      >
        <DataSearch
          componentId="searchbox"
          dataField={["id"]}
          placeholder="Search"
        />
        <ReactiveList
          componentId="results"
          pagination={true}
          react={{
            and: ["searchbox"],
          }}
          dataField="_id"
          size={5}
          defaultQuery={() => ({ track_total_hits: true })}
          render={({ data, error }) => (
            <Box sx={gridContainer}>
              {error && <Alert severity="error">Error: {error}</Alert>}
              {data.map((item: BeaconSearchItem) => {
                const result = parseBeaconSearchItem(item);
                return <div key={result._id}>{result._id}</div>;
              })}
            </Box>
          )}
        />
      </ReactiveBase>
    </div>
  );
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gridGap: 20,
};
