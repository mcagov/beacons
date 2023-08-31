import React, { FunctionComponent } from "react";
import Box from "@mui/material/Box";
import { DataGridPro, GridColDef, GridRowParams } from "@mui/x-data-grid-pro";
import { Button, Link } from "@mui/material";
import { TablePaginationActions } from "../TablePaginationActions";
import { IAccountHolderSearchResult } from "entities/IAccountHolderSearchResult";
import { Link as RouterLink } from "react-router-dom";
import { LoadingState } from "components/dataPanel/PanelLoadingState";
import {
  dateSortComparator,
  customDateValueFormatter,
} from "../../utils/DataGridUtils";

interface IAccountHolderTableProps {
  result: IAccountHolderSearchResult;
}

const columns: GridColDef[] = [
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
    valueFormatter: (params) => customDateValueFormatter(params),
    sortComparator: dateSortComparator,
  },
  {
    field: "lastModifiedDate",
    headerName: "Last Modified",
    width: 175,
    editable: false,
    type: "date",
    valueFormatter: (params) => customDateValueFormatter(params),
    sortComparator: dateSortComparator,
  },
  {
    field: "beaconCount",
    headerName: "Beacon Count",
    width: 150,
    align: "center",
    editable: false,
    type: "number",
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
    const [pageSize, setPageSize] = React.useState<number>(20);

    if (!result?._embedded) {
      return <LoadingState />;
    }

    let rows = result?._embedded?.accountHolderSearch || [];

    return (
      <Box sx={{ height: 850 }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          disableSelectionOnClick={true}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          componentsProps={{
            pagination: {
              ActionsComponent: TablePaginationActions,
            },
          }}
        />
      </Box>
    );
  });
