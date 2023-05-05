import React, { FunctionComponent, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Button, Link, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { customDateStringFormat } from "../../utils/dateTime";
import { IAccountHolderSearchResult } from "entities/IAccountHolderSearchResult";
import { Link as RouterLink } from "react-router-dom";

interface IAccountHolderTableProps {
  result: IAccountHolderSearchResult;
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
    field: "fullName",
    headerName: "Account Holder",
    width: 200,
    editable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <Link
        component={RouterLink}
        to={`/account-holder/${row.id}`}
        underline="hover"
      >
        {row.fullName}
      </Link>
    ),
  },
  {
    field: "email",
    headerName: "Email Address",
    width: 400,
    editable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <Link
        component={RouterLink}
        to={`/account-holder/${row.id}`}
        underline="hover"
      >
        {row.email}
      </Link>
    ),
  },
  {
    field: "createdDate",
    headerName: "Created",
    width: 175,
    editable: false,
    type: "date",
    valueFormatter: (params: GridValueFormatterParams) => {
      return customDateStringFormat(params.value, "DD/MM/yyyy");
    },
  },
  {
    field: "lastModifiedDate",
    headerName: "Last Modified",
    width: 175,
    editable: false,
    type: "date",
    valueFormatter: (params: GridValueFormatterParams) => {
      return customDateStringFormat(params.value, "DD/MM/yyyy");
    },
  },
  {
    field: "beaconCount",
    headerName: "Beacon Count",
    width: 150,
    align: "center",
    editable: false,
    type: "string",
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    sortable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <Button
        href={`/backoffice#/account-holder/${row.id}`}
        variant="outlined"
        sx={{ marginX: "auto" }}
      >
        View
      </Button>
    ),
  },
];

export const AccountHolderTable: FunctionComponent<IAccountHolderTableProps> =
  React.memo(function ({ result }): JSX.Element {
    const classes = useStyles();

    let rows = result?._embedded?.accountHolderSearch || [];

    return (
      <Box sx={{ height: 850 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick={true}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Box>
    );
  });
