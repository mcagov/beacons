import React from "react";
import Box from "@mui/material/Box";
import {
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Button, IconButton, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { customDateStringFormat } from "../utils/dateTime";
import { Link as RouterLink } from "react-router-dom";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage,
} from "@mui/icons-material";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

export function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

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
