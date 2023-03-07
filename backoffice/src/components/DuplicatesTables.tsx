import MaterialTable, {
  Column,
  Icons,
  MTableBodyRow,
  Query,
} from "@material-table/core";
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
} from "@mui/icons-material";
import React, { forwardRef, FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { IDuplicateSummary } from "../gateways/duplicates/IDuplicatesSummaryDTO";
import { TextFilter } from "./tableComponents/TextFilter";
import { Placeholders } from "../utils/writingStyle";
import { IDuplicatesGateway } from "../gateways/duplicates/IDuplicatesGateway";

interface IDuplicatesTableProps {
  duplicateSummaries: IDuplicateSummary[];
}

export type DuplicateRowData = Record<
  keyof Pick<IDuplicateSummary, "hexId" | "numberOfBeacons">,
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

const columns: Column<DuplicateRowData>[] = [
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
    render: (rowData: DuplicateRowData) => {
      return rowData.hexId ? rowData.hexId : <i>{Placeholders.NoData}</i>;
    },
  },
  {
    title: "Number of Beacons",
    field: "numberOfBeacons",
    render: (rowData: DuplicateRowData) => {
      return rowData.numberOfBeacons ? (
        rowData.numberOfBeacons
      ) : (
        <i>{Placeholders.NoData}</i>
      );
    },
  },
];

export const DuplicatesTable: FunctionComponent<IDuplicatesTableProps> =
  React.memo(function ({ duplicateSummaries }): JSX.Element {
    return (
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={duplicateSummaries}
        title=""
        options={{
          filtering: true,
          search: false,
          searchFieldVariant: "outlined",
          pageSize: 20,
        }}
      />
    );
  });
