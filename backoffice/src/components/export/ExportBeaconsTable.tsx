import React, { FunctionComponent, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Button, Chip, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import ContentPrintIcon from "@mui/icons-material/Print";
import { IBeaconExportSearchResult } from "views/exports/BeaconExportSearch";
import { customDateStringFormat } from "../../utils/dateTime";
interface IExportBeaconsTableProps {
  result: IBeaconExportSearchResult;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  })
);

const columns: GridColDef[] = [
  // { field: "id", headerName: "ID", width: 300 },
  {
    field: "hexId",
    headerName: "Hex ID",
    width: 175,
    resizable: true,
    editable: false,
  },
  {
    field: "beaconStatus",
    headerName: "Status",
    width: 150,
    resizable: true,
    editable: false,
  },
  {
    field: "createdDate",
    headerName: "Created date",
    width: 150,
    resizable: true,
    editable: false,
    type: "date",
    valueFormatter: (params: GridValueFormatterParams) => {
      return customDateStringFormat(params.value, "DD/MM/yyyy");
    },
  },
  {
    field: "lastModifiedDate",
    headerName: "Last modified date",
    width: 150,
    resizable: true,
    editable: false,
    type: "date",
    valueFormatter: (params: GridValueFormatterParams) => {
      return customDateStringFormat(params.value, "DD/MM/yyyy");
    },
  },

  {
    field: "ownerName",
    headerName: "Owner",
    width: 200,
    resizable: true,
    editable: false,
  },
  {
    field: "accountHolderName",
    headerName: "Account Holder",
    width: 200,
    resizable: true,
    editable: false,
  },
  {
    field: "useActivities",
    headerName: "Uses",
    width: 450,
    resizable: true,
    editable: false,
    type: "string",
  },
  {
    field: "vesselNames",
    headerName: "Vessel Names",
    width: 450,
    resizable: true,
    editable: false,
    type: "string",
  },
  {
    field: "registrationMarks",
    headerName: "Aircraft Reg Marks",
    width: 400,
    resizable: true,
    editable: false,
    type: "string",
  },
];

export const ExportBeaconsTable: FunctionComponent<IExportBeaconsTableProps> =
  React.memo(function ({ result }): JSX.Element {
    const [selectionModelItems, setSelectionModel] =
      useState<GridSelectionModel>([]);

    const classes = useStyles();

    let rows = result?._embedded?.beaconSearch || [];

    function CustomToolbar() {
      if (!selectionModelItems || selectionModelItems.length === 0) {
        return null;
      }

      return (
        <GridToolbarContainer>
          <GridToolbarExport printOptions={{ disableToolbarButton: true }} />

          <Button
            href={`backoffice#/labels/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className={classes.button}
            endIcon={<ContentPrintIcon />}
          >
            Label(s)
          </Button>
          <Button
            href={`backoffice#/certificates/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className={classes.button}
            endIcon={<ContentPrintIcon />}
          >
            Certificate(s)
          </Button>
          <Button
            href={`backoffice#/letters/registration/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className={classes.button}
            endIcon={<ContentPrintIcon />}
          >
            Registration Letter(s)
          </Button>
          <Button
            href={`backoffice#/letters/amended/${selectionModelItems.toString()}`}
            target="_blank"
            variant="outlined"
            className={classes.button}
            endIcon={<ContentPrintIcon />}
          >
            Amended Letter(s)
          </Button>
        </GridToolbarContainer>
      );
    }

    const isRowSelectable = (row: any) => {
      return !row.beaconStatus || row.beaconStatus.toUpperCase() !== "DELETED";
    };

    return (
      <Box sx={{ height: 850 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[10, 20, 50, 100]}
          checkboxSelection
          isRowSelectable={(params) => isRowSelectable(params.row)}
          onSelectionModelChange={setSelectionModel}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    );
  });
