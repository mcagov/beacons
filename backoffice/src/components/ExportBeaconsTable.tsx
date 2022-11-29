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
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import { IBeaconExportResult } from "views/BeaconExportSearch";
import { customDateStringFormat } from "../utils/dateTime";
interface IExportBeaconsTableProps {
  exportsGateway: IExportsGateway;
  data: IBeaconExportResult[];
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
    width: 150,
    editable: false,
  },
  {
    field: "beaconStatus",
    headerName: "Status",
    width: 150,
    editable: false,
  },
  {
    field: "createdDate",
    headerName: "Created date",
    width: 150,
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
    editable: false,
  },
  {
    field: "accountHolderName",
    headerName: "Account Holder",
    width: 200,
    editable: false,
  },
  {
    field: "useActivities",
    headerName: "Uses",
    width: 300,
    editable: false,
    type: "array",
  },
];

export const ExportBeaconsTable: FunctionComponent<IExportBeaconsTableProps> =
  React.memo(function ({ data }): JSX.Element {
    const [selectionModelItems, setSelectionModel] =
      useState<GridSelectionModel>([]);

    const classes = useStyles();

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

    return (
      <Box sx={{ height: 850 }}>
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
