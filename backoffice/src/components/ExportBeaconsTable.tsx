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
import { IBeaconExportSearchResult } from "views/BeaconExportSearch";
import { customDateStringFormat } from "../utils/dateTime";
interface IExportBeaconsTableProps {
  result: IBeaconExportSearchResult;
  setPage: any;
  setPageSize: any;
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
  React.memo(function ({ result, setPage, setPageSize }): JSX.Element {
    const [selectionModelItems, setSelectionModel] =
      useState<GridSelectionModel>([]);

    const classes = useStyles();

    let rows = result?._embedded?.beaconSearch || [];
    let page = result.page || {};

    console.log("rows: ", rows);
    console.log("page: ", page);

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
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pageSize={page.size}
          page={page.number}
          paginationMode="server"
          rowCount={page.totalElements}
          checkboxSelection
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSelectionModelChange={setSelectionModel}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    );
  });
