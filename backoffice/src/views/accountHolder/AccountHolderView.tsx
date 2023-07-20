import { Box, Button, Chip, Link, Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { IBeacon } from "../../entities/IBeacon";
import { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../../components/layout/PageContent";
import { logToServer } from "../../utils/logger";
import { IAccountHolder } from "../../entities/IAccountHolder";
import { IAccountHolderGateway } from "gateways/account-holder/IAccountHolderGateway";
import { AccountHolderSummaryView } from "./AccountHolderSummaryView";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { customDateStringFormat } from "utils/dateTime";
import { DataPanelStates } from "components/dataPanel/States";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import { EditPanelButton } from "components/dataPanel/EditPanelButton";
import { ErrorState } from "components/dataPanel/PanelErrorState";
import { LoadingState } from "components/dataPanel/PanelLoadingState";
import { AccountHolderSummaryEdit } from "./AccountHolderSummaryEdit";

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
  const [userState, setUserState] = useState<DataPanelStates>(
    DataPanelStates.Viewing
  );

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAccountHolder = async (id: string) => {
      try {
        setError(false);
        setLoading(true);

        const accountHolder = await accountHolderGateway.getAccountHolder(id);
        const beacons = await accountHolderGateway.getBeaconsForAccountHolderId(
          id
        );

        if (isMounted) {
          setAccountHolder(accountHolder);
          setBeacons(beacons);
          setLoading(false);
        }
      } catch (error) {
        logToServer.error(error);

        if (isMounted) {
          setError(true);
          setErrorMessage((error as Error).message);
          setLoading(false);
        }
      }
    };

    fetchAccountHolder(accountHolderId);

    return () => {
      isMounted = false;
    };
  }, [accountHolderId, accountHolderGateway]);

  const handleSave = async (
    updatedAccountHolder: Partial<IAccountHolder>
  ): Promise<void> => {
    try {
      await accountHolderGateway.updateAccountHolder(
        accountHolder.id,
        updatedAccountHolder
      );
      setUserState(DataPanelStates.Viewing);
    } catch (error: any) {
      logToServer.error(error);
      setError(true);
      setErrorMessage(error.message || "An unexpected error occurred");
    }
  };

  const renderState = (state: DataPanelStates) => {
    switch (state) {
      case DataPanelStates.Viewing:
        return (
          <>
            <OnlyVisibleToUsersWith role={"UPDATE_RECORDS"}>
              <EditPanelButton
                onClick={() => setUserState(DataPanelStates.Editing)}
              >
                Edit Account Holder
              </EditPanelButton>
            </OnlyVisibleToUsersWith>

            <AccountHolderSummaryView accountHolder={accountHolder} />
          </>
        );
      case DataPanelStates.Editing:
        return (
          <OnlyVisibleToUsersWith role={"UPDATE_RECORDS"}>
            <AccountHolderSummaryEdit
              accountHolder={accountHolder}
              onSave={handleSave}
              onCancel={() => setUserState(DataPanelStates.Viewing)}
            />
          </OnlyVisibleToUsersWith>
        );
      default:
        setErrorMessage(errorMessage);
        setError(true);
    }
  };

  const columns: GridColDef[] = [
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
      field: "status",
      headerName: "Status",
      width: 150,
      editable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Chip label={row.status} color="primary" />
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
          <div>
            <h2>Account Holder: {accountHolder?.fullName}</h2>
            {error && <ErrorState message={errorMessage} />}
            {loading && <LoadingState />}
            {error || loading || renderState(userState)}
          </div>
        </Paper>

        <Paper className={classes.paper}>
          <div>
            <h2>Beacons ({beacons.length})</h2>
            <Box sx={{ height: 850 }}>
              <DataGrid
                rows={beacons}
                columns={columns}
                disableSelectionOnClick={true}
                rowsPerPageOptions={[10, 20, 50, 100]}
              />
            </Box>
          </div>
        </Paper>
      </PageContent>
    </div>
  );
};
