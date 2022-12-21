import { Button, Grid, Tab, Tabs } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { CopyToClipboardButton } from "components/CopyToClipboardButton";
import { ILegacyBeacon } from "entities/ILegacyBeacon";
import { LegacyBeaconSummaryPanel } from "panels/legacyBeaconSummaryPanel/LegacyBeaconSummaryPanel";
import { LegacyEmergencyContactPanel } from "panels/legacyEmergencyContactPanel/LegacyEmergencyContactPanel";
import { LegacyOwnerPanel } from "panels/legacyOwnerPanel/LegacyOwnerPanel";
import { LegacyUsesListPanel } from "panels/usesPanel/LegacyUsesListPanel";
import React, { FunctionComponent, useEffect, useState } from "react";
import { formatForClipboard } from "utils/writingStyle";
import { PageContent } from "../components/layout/PageContent";
import { PageHeader } from "../components/layout/PageHeader";
import { TabPanel } from "../components/layout/TabPanel";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";
import { logToServer } from "../utils/logger";
import { BeaconStatuses } from "../entities/IBeacon";
import { IDeleteBeaconDto } from "../entities/IDeleteBeaconDto";
import { useHistory } from "react-router-dom";
import { DialogueBox } from "components/DialogueBox";
import { reasonsForDeletion } from "lib/BeaconDeletionReasons";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import { DialogueType } from "lib/DialogueType";
import { IConfirmDialogueModel } from "components/ConfirmDialogue";
import { SingleBeaconExportButtons } from "./exports/SingleBeaconExportButtons";

interface ISingleLegacyBeaconRecordViewProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
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

export const SingleLegacyBeaconRecordView: FunctionComponent<
  ISingleLegacyBeaconRecordViewProps
> = ({ beaconsGateway, beaconId }): JSX.Element => {
  const classes = useStyles();
  const routerHistory = useHistory();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const handleChange = (event: React.ChangeEvent<{}>, tab: number) => {
    setSelectedTab(tab);
  };

  const [beacon, setBeacon] = useState<ILegacyBeacon>({} as ILegacyBeacon);
  const [dialogueIsOpen, setDialogueIsOpen] = useState<boolean>(false);

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        const beacon = await beaconsGateway.getLegacyBeacon(id);
        setBeacon(beacon);
      } catch (error) {
        logToServer.error(error);
      }
    };

    fetchBeacon(beaconId);
  }, [beaconId, beaconsGateway]);
  const hexId = beacon?.hexId || "";
  const numberOfUses = beacon?.uses?.length.toString() || "";
  const legacyConfirmDialogueModel: IConfirmDialogueModel = {
    dialogueTitle:
      "Are you sure you want to permanently delete this migrated record?",
    dialogueContentText:
      "This will delete the beacon record, its owner(s), and all other associated information.",
    action: "Yes",
    dismissal: "No",
  };

  const openDialogueBox = () => {
    setDialogueIsOpen(true);
  };

  const handleDeleteDialogueAction = async (
    actionOptionSelected: boolean,
    reasonForAction: string
  ) => {
    setDialogueIsOpen(false);
    if (actionOptionSelected) {
      const deleteLegacyBeaconDto: IDeleteBeaconDto = {
        beaconId: beaconId,
        reason: reasonForAction,
      };
      await beaconsGateway.deleteBeacon(deleteLegacyBeaconDto);
      routerHistory.goBack();
    }
  };

  return (
    <div className={classes.root}>
      <PageHeader>
        Hex ID/UIN: {hexId}{" "}
        <span className={classes.button}>
          <CopyToClipboardButton
            text={formatForClipboard(beacon)}
            variant="outlined"
          />
        </span>
        <OnlyVisibleToUsersWith role={"ADMIN_EXPORT"}>
          <SingleBeaconExportButtons
            beaconId={beaconId}
            buttonClasses={classes.button}
          />
        </OnlyVisibleToUsersWith>
        <OnlyVisibleToUsersWith role={"DELETE_BEACONS"}>
          {beacon.beaconStatus !== BeaconStatuses.Deleted && (
            <span className={classes.button}>
              <Button
                onClick={openDialogueBox}
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete record
              </Button>
            </span>
          )}
        </OnlyVisibleToUsersWith>
      </PageHeader>
      <PageContent>
        <LegacyBeaconSummaryPanel legacyBeacon={beacon} />
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab label="Owner & Emergency Contacts" />
          <Tab label={`${numberOfUses} Registered Uses`} />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <Grid
            direction="row"
            container
            justifyContent="space-between"
            spacing={1}
          >
            <Grid item xs={6}>
              <LegacyOwnerPanel
                legacyOwner={beacon.owner}
                secondaryLegacyOwners={beacon.secondaryOwners}
              />
            </Grid>
            <Grid item xs={6}>
              <LegacyEmergencyContactPanel
                legacyEmergencyContact={beacon.emergencyContact}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <LegacyUsesListPanel uses={beacon.uses} />
        </TabPanel>
        <DialogueBox
          isOpen={dialogueIsOpen}
          dialogueType={DialogueType.DeleteBeacon}
          reasonsForAction={reasonsForDeletion}
          confirmDialogueModel={legacyConfirmDialogueModel}
          selectOption={handleDeleteDialogueAction}
        />
      </PageContent>
    </div>
  );
};
