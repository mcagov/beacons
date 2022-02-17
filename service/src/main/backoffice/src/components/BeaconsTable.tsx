import { Chip, Link, Paper } from "@material-ui/core";
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from "@material-ui/icons";
import {
  GetAllBeaconsFilters,
  GetAllBeaconsSort,
  IBeaconsGateway,
} from "gateways/beacons/IBeaconsGateway";
import MaterialTable, {
  Column,
  Icons,
  MTableBodyRow,
  Query,
} from "@material-table/core";
import React, { forwardRef, FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Placeholders } from "utils/writingStyle";
import { IBeaconSearchResultData } from "../entities/IBeaconSearchResult";
import { replaceNone } from "../lib/legacyData/replaceNone";
import { TextFilter } from "./tableComponents/TextFilter";

interface IBeaconsTableProps {
  beaconsGateway: IBeaconsGateway;
}

export type BeaconRowData = Record<
  keyof Pick<
    IBeaconSearchResultData,
    | "hexId"
    | "ownerName"
    | "useActivities"
    | "id"
    | "lastModifiedDate"
    | "beaconStatus"
    | "beaconType"
    | "cospasSarsatNumber"
    | "manufacturerSerialNumber"
  >,
  string
>;

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const columns: Column<BeaconRowData>[] = [
  {
    title: "Last modified date",
    field: "lastModifiedDate",
    filtering: false,
    defaultSort: "desc",
    type: "datetime",
    dateSetting: { format: "dd MM yyyy", locale: "en-GB" },
  },
  {
    title: "Status",
    field: "beaconStatus",
    lookup: { NEW: "NEW", MIGRATED: "MIGRATED", DELETED: "DELETED" },
    render: (rowData: BeaconRowData) => {
      if (rowData.beaconStatus === "MIGRATED") {
        return <Chip label={rowData.beaconStatus} color="secondary" />;
      } else {
        return <Chip label={rowData.beaconStatus} color="primary" />;
      }
    },
  },
  {
    title: "Hex ID",
    field: "hexId",
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter hex id"
      />
    ),
    render: (rowData: BeaconRowData) => {
      if (rowData.beaconType === "LEGACY_BEACON") {
        return (
          <Link component={RouterLink} to={"/legacy-beacons/" + rowData.id}>
            {rowData.hexId ? rowData.hexId : <i>{Placeholders.NoData}</i>}
          </Link>
        );
      } else {
        return (
          <Link component={RouterLink} to={"/beacons/" + rowData.id}>
            {rowData.hexId ? rowData.hexId : <i>{Placeholders.NoData}</i>}
          </Link>
        );
      }
    },
  },
  {
    title: "Owner details",
    field: "ownerName",
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter owner name"
      />
    ),
    render: (rowData: BeaconRowData) => {
      return rowData.ownerName ? rowData.ownerName.toUpperCase() : "";
    },
  },
  {
    title: "Beacon use",
    field: "useActivities",
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter beacon uses"
      />
    ),
    render: (rowData: BeaconRowData) => {
      return rowData.useActivities ? rowData.useActivities.toUpperCase() : "";
    },
  },
  {
    title: "Manufacturer serial number",
    field: "manufacturerSerialNumber",
    render: (rowData: BeaconRowData) =>
      replaceNone(rowData.manufacturerSerialNumber),
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter manufacturer serial number"
      />
    ),
  },
  {
    title: "Cospas-Sarsat number",
    field: "cospasSarsatNumber",
    render: (rowData: BeaconRowData) => replaceNone(rowData.cospasSarsatNumber),
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter cospas-sarsat number"
      />
    ),
  },
];

export const BeaconsTable: FunctionComponent<IBeaconsTableProps> = React.memo(
  function ({ beaconsGateway }): JSX.Element {
    return (
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={(query) =>
          new Promise(async (resolve, _reject) => {
            try {
              const response = await beaconsGateway.getAllBeacons(
                ...buildTableQuery(query)
              );
              const beacons = response._embedded.beaconSearch.map(
                (item: IBeaconSearchResultData): BeaconRowData => ({
                  lastModifiedDate: item.lastModifiedDate,
                  beaconStatus: item.beaconStatus,
                  hexId: item.hexId,
                  ownerName: item.ownerName ?? "N/A",
                  useActivities: item.useActivities ?? "N/A",
                  id: item.id,
                  beaconType: item.beaconType,
                  cospasSarsatNumber: item.cospasSarsatNumber ?? "N/A",
                  manufacturerSerialNumber:
                    item.manufacturerSerialNumber ?? "N/A",
                })
              );
              resolve({
                data: beacons,
                page: response.page.number,
                totalCount: response.page.totalElements,
              });
            } catch (error) {
              console.error("Could not fetch beacons", error);
              alert("Search timed out, please try refreshing in 30 seconds");
            }
          })
        }
        title=""
        options={{
          filtering: true,
          search: false,
          searchFieldVariant: "outlined",
          pageSize: 20,
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Row: (props) => (
            <MTableBodyRow {...props} data-testid="beacons-table-row" />
          ),
        }}
      />
    );
  }
);

function buildTableQuery(
  query: Query<BeaconRowData>
): Parameters<IBeaconsGateway["getAllBeacons"]> {
  const term = query.search;

  // typeof filters could be wider than GetAllBeaconsFilter but that's ok here
  // This is necessary due to weaker type definitions from @material-table/core
  const filters: Partial<Record<keyof BeaconRowData, string>> = {};
  query.filters.forEach((filter) => {
    if (filter.column.field) {
      filters[filter.column.field as keyof BeaconRowData] = filter.value;
    }
  });

  let sort: GetAllBeaconsSort = null;
  if (query.orderBy && query.orderBy.field && query.orderDirection) {
    sort = [query.orderBy.field as keyof BeaconRowData, query.orderDirection];
  }

  return [
    term,
    filters as GetAllBeaconsFilters,
    query.page,
    query.pageSize,
    sort,
  ];
}
