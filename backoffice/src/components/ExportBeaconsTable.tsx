import React, { FunctionComponent, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import ContentPrintIcon from "@mui/icons-material/Print";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { IBeaconExportResult } from "views/BeaconExportSearch";
interface IExportBeaconsTableProps {
  exportsGateway: IExportsGateway;
  data: IBeaconExportResult[];
}

const columns: GridColDef[] = [
  // { field: "id", headerName: "ID", width: 300 },
  {
    field: "hexId",
    headerName: "Hex ID",
    width: 150,
    editable: false,
  },
  {
    field: "beaconStatus",
    headerName: "Status",
    width: 150,
    editable: false,
    // valueFormatter: (params: GridValueFormatterParams) => {
    //   return <Chip label={params.value} color={params.value === "MIGRATED"?"secondary":"primary"} />;
    // }
  },
  {
    field: "createdDate",
    headerName: "Created date",
    width: 250,
    editable: false,
    type: "date",
    // valueFormatter: (params: GridValueFormatterParams) => {
    //   // first converts to JS Date, then to locale option through date-fns
    //   return formatDate(params.value);
    // },
    // // valueGetter for filtering
    // valueGetter: (params: GridValueGetterParams) => {
    //   return formatDate(params.value);
    // },
  },
  {
    field: "lastModifiedDate",
    headerName: "Last modified date",
    width: 250,
    editable: false,
    type: "date",
    // valueFormatter: (params: GridValueFormatterParams) => {
    //   // first converts to JS Date, then to locale option through date-fns
    //   return formatDate(params.value);
    // },
    // // valueGetter for filtering
    // valueGetter: (params: GridValueGetterParams) => {
    //   return formatDate(params.value);
    // },
  },

  {
    field: "ownerName",
    headerName: "Owner",
    width: 150,
    editable: false,
  },
  {
    field: "accountHolderName",
    headerName: "Account Holder",
    width: 150,
    editable: false,
  },
  {
    field: "useActivities",
    headerName: "Uses",
    width: 250,
    editable: false,
    type: "array",
  },
];

export const ExportBeaconsTable: FunctionComponent<IExportBeaconsTableProps> =
  React.memo(function ({ data }): JSX.Element {
    const [selectionModelItems, setSelectionModel] =
      useState<GridSelectionModel>([]);

    function CustomToolbar() {
      if (!selectionModelItems || selectionModelItems.length === 0) {
        return null;
      }

      return (
        <GridToolbarContainer>
          <Button
            href={`backoffice#/labels/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className="ml-2"
            endIcon={<ContentPrintIcon />}
          >
            Label(s)
          </Button>
          <Button
            href={`backoffice#/certificates/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className="ml-2"
            endIcon={<ContentPrintIcon />}
          >
            Certificate(s)
          </Button>
          <Button
            href={`backoffice#/letters/registration/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className="m-2"
            endIcon={<ContentPrintIcon />}
          >
            Registration Letter(s)
          </Button>
          <Button
            href={`backoffice#/letters/amended/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className="m-2"
            endIcon={<ContentPrintIcon />}
          >
            Amended Letter(s)
          </Button>
          <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
        </GridToolbarContainer>
      );
    }

    return (
      <Box sx={{ height: 800 }}>
        <DataGrid
          rows={data}
          columns={columns}
          rowsPerPageOptions={[20, 50, 100]}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            console.log("ids is : ", ids);
            setSelectionModel(ids);
          }}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    );
  });
