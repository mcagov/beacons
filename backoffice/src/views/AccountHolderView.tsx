import { Button, Grid, Tab, Tabs } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { IBeacon } from "../entities/IBeacon";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../components/layout/PageContent";
import { PageHeader } from "../components/layout/PageHeader";
import { BeaconSummaryPanel } from "../panels/beaconSummaryPanel/BeaconSummaryPanel";
import { logToServer } from "../utils/logger";
import { DialogueBox } from "components/DialogueBox";
import { useHistory } from "react-router-dom";
import { AccountHolderPanel } from "../panels/accountHolderPanel/AccountHolderPanel";
import { IAccountHolder } from "../entities/IAccountHolder";
import { IAccountHolderGateway } from "gateways/account-holder/IAccountHolderGateway";

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
  // const routerHistory = useHistory();

  const [accountHolder, setAccountHolder] = useState<IAccountHolder>(
    {} as IAccountHolder
  );
  const [beacons, setBeacons] = useState<IBeacon[]>([] as IBeacon[]);
  // const [dialogueIsOpen, setDialogueIsOpen] = useState<boolean>(false);

  useEffect((): void => {
    const fetchAccountHolder = async (id: string) => {
      try {
        const accountHolder = await accountHolderGateway.getAccountHolder(id);
        console.log(accountHolder);
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

  // const modernConfirmDialogueModel: IConfirmDialogueModel = {
  //   dialogueTitle: "Are you sure you want to permanently delete this account holder?",
  //   dialogueContentText:
  //     "This will delete the account holder, and all associated information.",
  //   action: "Yes",
  //   dismissal: "No",
  // };

  // const openDialogueBox = () => {
  //   setDialogueIsOpen(true);
  // };

  // const handleDeleteDialogueAction = async (
  //   actionOptionSelected: boolean,
  //   reasonForAction: string
  // ) => {
  //   setDialogueIsOpen(false);
  //   if (actionOptionSelected) {
  //     const deleteAccountHolderDto: IDeleteAccountHolderDto = {
  //       accountHolderId: accountHolderId,
  //       reason: reasonForAction,
  //     };
  //     await beaconsGateway.deleteAccountHolder(deleteAccountHolderDto);
  //     routerHistory.goBack();
  //   }
  // };

  return (
    <div className={classes.root}>
      <PageHeader>Account Holder</PageHeader>
      <PageContent>
        <p>Some account holder content.</p>
        <p>{JSON.stringify(accountHolder)}</p>
        {/* <AccountHolderPanel
          beaconsGateway={beaconsGateway}
          beaconId={beaconId}
        /> */}
        {/* <DialogueBox
          isOpen={dialogueIsOpen}
          dialogueType={DialogueType.DeleteBeacon}
          reasonsForAction={reasonsForDeletion}
          confirmDialogueModel={modernConfirmDialogueModel}
          selectOption={handleDeleteDialogueAction}
        /> */}
      </PageContent>
    </div>
  );
};
