import { Button, Grid, Tab, Tabs } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { CopyToClipboardButton } from "components/CopyToClipboardButton";
import { BeaconStatuses, IBeacon } from "../entities/IBeacon";
import { INote } from "entities/INote";
import { IUsesGateway } from "gateways/uses/IUsesGateway";
import { OwnerPanel } from "panels/ownerPanel/OwnerPanel";
import { UsesListPanel } from "panels/usesPanel/UsesListPanel";
import React, { FunctionComponent, useEffect, useState } from "react";
import { formatForClipboardWithNotes } from "utils/writingStyle";
import { PageContent } from "../components/layout/PageContent";
import { PageHeader } from "../components/layout/PageHeader";
import { TabPanel } from "../components/layout/TabPanel";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";
import { INotesGateway } from "../gateways/notes/INotesGateway";
import { BeaconSummaryPanel } from "../panels/beaconSummaryPanel/BeaconSummaryPanel";
import { EmergencyContactPanel } from "../panels/emergencyContactPanel/EmergencyContactPanel";
import { NotesPanel } from "../panels/notesPanel/NotesPanel";
import { logToServer } from "../utils/logger";
import { DialogueBox } from "components/DialogueBox";
import { useHistory } from "react-router-dom";
import { IDeleteBeaconDto } from "../entities/IDeleteBeaconDto";
import { reasonsForDeletion } from "lib/BeaconDeletionReasons";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import { DialogueType } from "lib/DialogueType";
import { IConfirmDialogueModel } from "components/ConfirmDialogue";
import { SingleBeaconExportButtons } from "./exports/SingleBeaconExportButtons";

interface ISingleBeaconRecordViewProps {
  beaconsGateway: IBeaconsGateway;
  usesGateway: IUsesGateway;
  notesGateway: INotesGateway;
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

export const SingleBeaconRecordView: FunctionComponent<
  ISingleBeaconRecordViewProps
> = ({ beaconsGateway, usesGateway, notesGateway, beaconId }): JSX.Element => {
  const classes = useStyles();
  const routerHistory = useHistory();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const handleChange = (event: React.ChangeEvent<{}>, tab: number) => {
    setSelectedTab(tab);
  };

  const [beacon, setBeacon] = useState<IBeacon>({} as IBeacon);
  const [notes, setNotes] = useState<INote[]>([] as INote[]);
  const [dialogueIsOpen, setDialogueIsOpen] = useState<boolean>(false);

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        const beacon = await beaconsGateway.getBeacon(id);
        const notes = await notesGateway.getNotes(beaconId);
        setNotes(notes);
        setBeacon(beacon);
      } catch (error) {
        logToServer.error(error);
      }
    };

    fetchBeacon(beaconId);
  }, [beaconId, beaconsGateway, notesGateway]);

  const hexId = beacon?.hexId || "";
  const numberOfUses = beacon?.uses?.length.toString() || "";
  const modernConfirmDialogueModel: IConfirmDialogueModel = {
    dialogueTitle: "Are you sure you want to permanently delete this record?",
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
      const deleteBeaconDto: IDeleteBeaconDto = {
        beaconId: beaconId,
        reason: reasonForAction,
      };
      await beaconsGateway.deleteBeacon(deleteBeaconDto);
      routerHistory.goBack();
    }
  };

  return (
    <div className={classes.root}>
      <PageHeader>
        Hex ID/UIN: {hexId}
        <span className={classes.button}>
          <CopyToClipboardButton
            text={formatForClipboardWithNotes(beacon, notes)}
            variant="outlined"
          />
        </span>
        {beacon.status !== BeaconStatuses.Deleted && (
          <span>
            <OnlyVisibleToUsersWith role={"ADMIN_EXPORT"}>
              <SingleBeaconExportButtons
                beaconId={beaconId}
                buttonClasses={classes.button}
              />
            </OnlyVisibleToUsersWith>
            {/* <OnlyVisibleToUsersWith role={"DELETE_BEACONS"}>
              <span className={classes.button}>
                <Button
                  onClick={openDialogueBox}
                  variant="outlined"
                  color="error"
                  endIcon={<DeleteIcon />}
                >
                  Delete record
                </Button>
              </span>
            </OnlyVisibleToUsersWith> */}
          </span>
        )}
      </PageHeader>
      <PageContent>
        <BeaconSummaryPanel
          beaconsGateway={beaconsGateway}
          beaconId={beaconId}
        />
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab label="Owner & Emergency Contacts" />
          <Tab label={`${numberOfUses} Registered Uses`} />
          <Tab label={`Notes`} />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <Grid
            direction="row"
            container
            justifyContent="space-between"
            spacing={1}
          >
            <Grid item xs={6}>
              <OwnerPanel beaconsGateway={beaconsGateway} beaconId={beaconId} />
            </Grid>
            <Grid item xs={6}>
              <EmergencyContactPanel
                beaconsGateway={beaconsGateway}
                beaconId={beaconId}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <UsesListPanel usesGateway={usesGateway} beaconId={beaconId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
        </TabPanel>
        <DialogueBox
          isOpen={dialogueIsOpen}
          dialogueType={DialogueType.DeleteBeacon}
          reasonsForAction={reasonsForDeletion}
          confirmDialogueModel={modernConfirmDialogueModel}
          selectOption={handleDeleteDialogueAction}
        />
      </PageContent>
    </div>
  );
};
