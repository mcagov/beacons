import { Icons, Query } from "@material-table/core";
import { IBeaconsGateway } from "gateways/beacons/IBeaconsGateway";
import React, { forwardRef, FunctionComponent, useState } from "react";
import { IBeaconSearchResultData } from "../entities/IBeaconSearchResult";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridValueFormatterParams,
  GridValueGetterParams,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import { AuthenticatedPrintButton } from "./AuthenticatedPrintButton";
import { applicationConfig } from "config";
import { Button } from "@mui/material";
import ContentPrintIcon from "@mui/icons-material/Print";
interface IBeaconsTableProps {
  beaconsGateway: IBeaconsGateway;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "hexId",
    headerName: "Hex ID",
    width: 150,
    editable: false,
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
    field: "beaconStatus",
    headerName: "Status",
    width: 150,
    editable: false,
    // valueFormatter: (params: GridValueFormatterParams) => {
    //   return <Chip label={params.value} color={params.value === "MIGRATED"?"secondary":"primary"} />;
    // }
  },

  {
    field: "ownerName",
    headerName: "Owner",
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

const rows = [
  {
    id: "88a581c3-00c7-4986-a380-477cd6af2152",
    lastModifiedDate: new Date(),
    beaconStatus: "NEW",
    hexId: "1234DD",
    ownerName: "Sam Kendell",
    useActivities: ["MARITIME", "AVIATION"],
  },
  {
    id: "a7084ff9-e260-4964-9fc4-b6bff19d8737",
    lastModifiedDate: new Date(),
    beaconStatus: "MIGRATED",
    hexId: "1234DD",
    ownerName: "Sam Kendell",
    useActivities: ["MARITIME", "AVIATION"],
  },
  {
    id: "2bad8f1a-39f5-47f8-83af-81d55fb63e51",
    lastModifiedDate: new Date(),
    beaconStatus: "NEW",
    hexId: "1234DD",
    ownerName: "Sam Kendell",
    useActivities: ["MARITIME", "AVIATION"],
  },
  {
    id: "82814e17-2e64-4a2b-8c02-b4fc1dc205eb",
    lastModifiedDate: new Date(),
    beaconStatus: "NEW",
    hexId: "1234DD",
    ownerName: "Sam Kendell",
    useActivities: ["MARITIME", "AVIATION"],
  },
  {
    id: "68d23980-48ee-4f49-8f22-06e0e44b9400",
    lastModifiedDate: new Date(),
    beaconStatus: "NEW",
    hexId: "1234DD",
    ownerName: "Sam Kendell",
    useActivities: ["MARITIME", "AVIATION"],
  },
];

export const ExportBeaconsTable: FunctionComponent<IBeaconsTableProps> =
  React.memo(function ({ beaconsGateway }): JSX.Element {
    const [selectionModelItems, setSelectionModel] =
      React.useState<GridSelectionModel>([]);

    // React.useEffect(() => {
    //   const parsedArrayFromLocalStorage = JSON.parse(localStorage?.getItem("SelectedOption") || "[]");
    //   const mappedArray = parsedArrayFromLocalStorage.map((item: any) => {
    //     return item;

    //   }, [selectionModelItems]);
    //   console.log("log", mappedArray);
    //   setSelectionModel(mappedArray);

    // }, []);

    function CustomToolbar() {
      if (!selectionModelItems || selectionModelItems.length === 0) {
        return null;
      }

      return (
        <GridToolbarContainer>
          {/* <GridToolbarExport /> */}
          <p>{JSON.stringify(selectionModelItems)}</p>
          <AuthenticatedPrintButton
            label="Print labels"
            url={`${
              applicationConfig.apiUrl
            }/export/labels/${selectionModelItems.toString()}`}
            isFullWidth={false}
          />
          <Button
            href={`/backoffice#/certificates/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            endIcon={<ContentPrintIcon />}
          >
            Print certificate
          </Button>
        </GridToolbarContainer>
      );
    }

    return (
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={3}
          rowsPerPageOptions={[1, 5, 10, 20]}
          checkboxSelection
          // disableSelectionOnClick
          // selectionModel={selectionModel}
          onSelectionModelChange={(ids) => {
            console.log("ids is : ", ids);
            setSelectionModel(ids);
          }}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    );
  });
