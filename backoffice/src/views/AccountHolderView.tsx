import { Box, Button, Card, CardContent, Link, Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { IBeacon } from "../entities/IBeacon";
import { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../components/layout/PageContent";
import { PageHeader } from "../components/layout/PageHeader";
import { logToServer } from "../utils/logger";
import { IAccountHolder } from "../entities/IAccountHolder";
import { IAccountHolderGateway } from "gateways/account-holder/IAccountHolderGateway";
import { PanelViewingState } from "components/dataPanel/PanelViewingState";
import { FieldValueTypes } from "components/dataPanel/FieldValue";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { customDateStringFormat } from "utils/dateTime";

interface IAccountHolderViewProps {
  accountHolderGateway: IAccountHolderGateway;
  accountHolderId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  })
);

export const AccountHolderView: FunctionComponent<IAccountHolderViewProps> = ({
  accountHolderGateway,
  accountHolderId,
}): JSX.Element => {
  const classes = useStyles();

  const [accountHolder, setAccountHolder] = useState<IAccountHolder>(
    {} as IAccountHolder
  );
  const [beacons, setBeacons] = useState<IBeacon[]>([] as IBeacon[]);

  useEffect((): void => {
    const fetchAccountHolder = async (id: string) => {
      try {
        const accountHolder = await accountHolderGateway.getAccountHolder(id);
        const beacons = await accountHolderGateway.getBeaconsForAccountHolderId(
          id
        );
        setAccountHolder(accountHolder);
        setBeacons(beacons);
      } catch (error) {
        logToServer.error(error);
      }
    };

    fetchAccountHolder(accountHolderId);
  }, [accountHolderId, accountHolderGateway]);

  const accountHolderFields = [
    { key: "Name", value: accountHolder?.fullName },
    { key: "Telephone", value: accountHolder?.telephoneNumber },
    {
      key: "Alternative Telephone",
      value: accountHolder?.alternativeTelephoneNumber,
    },
    { key: "Email", value: accountHolder?.email },
    {
      key: "Address",
      value: [
        accountHolder?.addressLine1,
        accountHolder?.addressLine2,
        accountHolder?.addressLine3,
        accountHolder?.addressLine4,
        accountHolder?.townOrCity,
        accountHolder?.county,
        accountHolder?.postcode,
        accountHolder?.country || "United Kingdom",
      ],
      valueType: FieldValueTypes.MULTILINE,
    },
    { key: "Created", value: accountHolder?.createdDate },
    {
      key: "Last Modified",
      value: accountHolder?.lastModifiedDate,
    },
  ];

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 300 },

    {
      field: "hexId",
      headerName: "Hex ID",
      width: 200,
      editable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Link
          component={RouterLink}
          to={`/beacons/${row.id}`}
          underline="hover"
        >
          {row.hexId}
        </Link>
      ),
    },
    {
      field: "mainUseName",
      headerName: "Main Use",
      width: 175,
      editable: false,
      type: "string",
    },
    {
      field: "coding",
      headerName: "Coding",
      width: 175,
      editable: false,
      type: "string",
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
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Button
          href={`/backoffice#/beacons/${row.id}`}
          variant="outlined"
          sx={{ marginX: "auto" }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <PageContent>
        <Paper className={classes.paper}>
          <h2>Account Holder: {accountHolder?.fullName}</h2>
          <PanelViewingState fields={accountHolderFields} />
        </Paper>

        <Paper className={classes.paper}>
          <h2>Beacons ({beacons.length})</h2>
          <Box sx={{ height: 850 }}>
            <DataGrid
              rows={beacons}
              columns={columns}
              disableSelectionOnClick={true}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </Box>
        </Paper>
      </PageContent>
    </div>
  );
};
