import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
  TextField,
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

import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridSelectionModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { DataPanelStates } from "components/dataPanel/States";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import { EditPanelButton } from "components/dataPanel/EditPanelButton";
import { ErrorState } from "components/dataPanel/PanelErrorState";
import { LoadingState } from "components/dataPanel/PanelLoadingState";
import { AccountHolderSummaryEdit } from "./AccountHolderSummaryEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IAccountHolderSearchResultData } from "entities/IAccountHolderSearchResult";
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
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [beaconsToTransfer, setBeaconsToTransfer] =
    useState<GridSelectionModel>([]);
  const [accountHolders, setAccountHolders] = useState<
    IAccountHolderSearchResultData[]
  >([] as IAccountHolderSearchResultData[]);
  const [transferAccountHolder, setTransferAccountHolder] =
    useState<IAccountHolderSearchResultData>(
      {} as IAccountHolderSearchResultData
    );

  useEffect(() => {
    let isMounted = true;

    const fetchAccountHolder = async (id: string) => {
      try {
        setError(false);
        setLoading(true);

        const accountHolders =
          await accountHolderGateway.getAllAccountHolders();
        const accountHolder = await accountHolderGateway.getAccountHolder(id);
        const beacons = await accountHolderGateway.getBeaconsForAccountHolderId(
          id
        );

        if (isMounted) {
          setAccountHolder(accountHolder);
          setBeacons(beacons);
          setAccountHolders(accountHolders._embedded.accountHolderSearch);
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

  const handleTransferBeacons = async () => {
    if (beaconsToTransfer.length < 1) {
      setError(true);
      setErrorMessage("Cannot transfer zero Beacons");
      return;
    }

    setOpenTransferDialog(true);
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

  const handleConfirmTransfer = async () => {
    try {
      const beaconIds = beaconsToTransfer.map((row: GridRowId) =>
        row.toString()
      );
      await accountHolderGateway.transferBeaconsToAccountHolder(
        beaconIds,
        transferAccountHolder.id
      );
      window.location.reload();
    } catch (error) {
      logToServer.error(error);
      setError(true);
      setErrorMessage(
        "An error occurred while transferring the account holder's beacons."
      );
    } finally {
      setOpenTransferDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleCancelTransfer = () => {
    setOpenTransferDialog(false);
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
        <Chip
          label={row.status}
          color={row.status === "CHANGE" ? "info" : "primary"}
        />
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

  function BeaconToolbar() {
    if (!beaconsToTransfer || beaconsToTransfer.length === 0) {
      return null;
    }

    return (
      <GridToolbarContainer>
        <Button onClick={handleTransferBeacons} variant="outlined">
          Transfer
        </Button>
      </GridToolbarContainer>
    );
  }

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
                  <Button
                    variant="outlined"
                    color="error"
                    endIcon={<DeleteIcon />}
                    onClick={handleDeleteAccountHolder}
                    className={classes.buttons}
                    disabled={beacons.length !== 0}
                  >
                    Delete Account Holder
                  </Button>
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
              rowsPerPageOptions={[10, 20, 50, 100]}
              checkboxSelection
              onSelectionModelChange={setBeaconsToTransfer}
              components={{ Toolbar: BeaconToolbar }}
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

        <Dialog
          open={openTransferDialog}
          onClose={handleCancelTransfer}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Transfer</DialogTitle>
          <DialogContent>
            <Box>Are you sure you want to transfer these Beacons?</Box>
            <Box>
              <br />
              You are transferring the following Beacons:
              <ul>
                {beaconsToTransfer.map((beaconId, index) => {
                  const beacon = beacons.find((b) => b.id === beaconId);
                  return (
                    <li key={index}>
                      {beacon && `${beacon.hexId} - (${beacon.mainUseName})`}
                    </li>
                  );
                })}
              </ul>
            </Box>
            <Box>
              <Autocomplete
                value={transferAccountHolder}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setTransferAccountHolder(newValue);
                  }
                }}
                options={accountHolders}
                getOptionLabel={(option) =>
                  option.email || "Please select an account holder"
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Account Holder"
                    variant="outlined"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.email} - ({option.fullName})
                  </li>
                )}
              />
              {transferAccountHolder && transferAccountHolder.email && (
                <div>
                  <h4>To the following account holder:</h4>
                  <p>Name: {transferAccountHolder.fullName}</p>
                  <p>Email: {transferAccountHolder.email}</p>
                  {/* Add more details as needed */}
                </div>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelTransfer}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmTransfer}
              color="primary"
              variant="outlined"
              disabled={
                transferAccountHolder == null ||
                transferAccountHolder.email == null
              }
            >
              Transfer Beacons
            </Button>
          </DialogActions>
        </Dialog>
      </PageContent>
    </div>
  );
};
