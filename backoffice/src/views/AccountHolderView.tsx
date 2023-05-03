import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
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
import { PanelViewingState } from "components/dataPanel/PanelViewingState";
import { FieldValueTypes } from "components/dataPanel/FieldValue";
import { formatSvdr } from "utils/writingStyle";

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

  const getBeaconFields = (beacon: IBeacon) => [
    {
      key: "Beacon status",
      value: beacon?.status,
    },
    {
      key: "Manufacturer",
      value: beacon?.manufacturer,
    },
    {
      key: "Model",
      value: beacon?.model,
    },
    {
      key: "Serial number",
      value: beacon?.manufacturerSerialNumber,
    },
    {
      key: "CHK code",
      value: beacon?.chkCode,
    },
    {
      key: "Beacon type",
      value: beacon?.beaconType,
    },
    {
      key: "Protocol",
      value: beacon?.protocol,
    },
    {
      key: "Coding",
      value: beacon?.coding,
    },
    {
      key: "CSTA / TAC",
      value: beacon?.csta,
    },
    {
      key: "MTI",
      value: beacon?.mti,
    },
    {
      key: "SVDR",
      value: formatSvdr(beacon?.svdr),
    },
    {
      key: "Battery expiry date",
      value: beacon?.batteryExpiryDate,
    },
    {
      key: "Last serviced date",
      value: beacon?.lastServicedDate,
    },
    {
      key: "Created date",
      value: beacon?.registeredDate,
    },
    {
      key: "Last modified date",
      value: beacon?.lastModifiedDate,
    },
    {
      key: "Reference",
      value: beacon?.referenceNumber,
    },
  ];

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
      <PageHeader>Account Holder: {accountHolder?.fullName}</PageHeader>
      <PageContent>
        <Card>
          <CardContent>
            <PanelViewingState fields={accountHolderFields} />
          </CardContent>
        </Card>

        <PageHeader>Beacons ({beacons.length}): </PageHeader>

        <Grid
          direction="row"
          container
          justifyContent="space-between"
          spacing={2}
        >
          {beacons.map((beacon) => (
            <Grid item xs={beacons.length > 2 ? 4 : 6} key={beacon.id}>
              <Card>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                  >
                    <CardHeader title={`Hex ID/UIN: ${beacon.hexId}`} />

                    <Button
                      target="_blank"
                      href={`/backoffice#/beacons/${beacon.id}`}
                      variant="outlined"
                      sx={{ marginY: "auto" }}
                    >
                      View
                    </Button>
                  </Grid>
                  <PanelViewingState fields={getBeaconFields(beacon)} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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
