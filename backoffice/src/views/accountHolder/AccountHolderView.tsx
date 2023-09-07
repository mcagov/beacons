import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
} from "@mui/material";
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
  dateSortComparator,
  customDateValueFormatter,
} from "../../utils/DataGridUtils";

import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { DataPanelStates } from "components/dataPanel/States";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import { EditPanelButton } from "components/dataPanel/EditPanelButton";
import { ErrorState } from "components/dataPanel/PanelErrorState";
import { LoadingState } from "components/dataPanel/PanelLoadingState";
import { AccountHolderSummaryEdit } from "./AccountHolderSummaryEdit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    flexContainer: {
      display: "flex",
      alignItems: "end",
    },
    h2: {
      flexGrow: 1,
    },
    buttons: {},
  })
);

export const AccountHolderView: FunctionComponent<IAccountHolderViewProps> = ({
  accountHolderGateway,
  accountHolderId,
}): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
      window.location.reload();
    } catch (error: any) {
      logToServer.error(error);
      setError(true);
      setErrorMessage(error.message || "An unexpected error occurred");
    }
  };

  const handleDeleteAccountHolder = async () => {
    if (beacons.length > 0) {
      setError(true);
      setErrorMessage(
        "Cannot delete an account holder with associated beacons"
      );
      return;
    }

    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await accountHolderGateway.deleteAccountHolder(accountHolder.id);
      setOpenDeleteDialog(false);
      history.push("/account-holders");
    } catch (error) {
      logToServer.error(error);
      setError(true);
      setErrorMessage("An error occurred while deleting the account holder.");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const renderState = (state: DataPanelStates) => {
    switch (state) {
      case DataPanelStates.Viewing:
        return <AccountHolderSummaryView accountHolder={accountHolder} />;
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
      field: "registeredDate",
      headerName: "Registered",
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
          <>
            <div className={classes.flexContainer}>
              <h2 className={classes.h2}>
                Account Holder: {accountHolder?.fullName}
              </h2>
              {userState === DataPanelStates.Viewing && (
                <OnlyVisibleToUsersWith role={"UPDATE_RECORDS"}>
                  <EditPanelButton
                    onClick={() => setUserState(DataPanelStates.Editing)}
                  >
                    Edit Account Holder
                  </EditPanelButton>
                  {beacons.length === 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      endIcon={<DeleteIcon />}
                      onClick={handleDeleteAccountHolder}
                      className={classes.buttons}
                    >
                      Delete Account Holder
                    </Button>
                  )}
                </OnlyVisibleToUsersWith>
              )}
            </div>

            {error && <ErrorState message={errorMessage} />}
            {loading && <LoadingState />}
            {error || loading || renderState(userState)}
          </>
        </Paper>

        <Paper className={classes.paper}>
          <h2>Beacons ({beacons.length})</h2>
          <Box sx={{ height: beacons.length > 5 ? 1000 : 500 }}>
            <DataGrid
              rows={beacons}
              columns={columns}
              disableSelectionOnClick={true}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </Box>
        </Paper>
        <Dialog
          open={openDeleteDialog}
          onClose={handleCancelDelete}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Box>Are you sure you want to delete this account holder?</Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelDelete}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="outlined"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </PageContent>
    </div>
  );
};
