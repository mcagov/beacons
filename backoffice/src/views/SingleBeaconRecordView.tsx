import { Button, Grid, Tab, Tabs } from "@mui/material";
import ContentPrintIcon from "@mui/icons-material/Print";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { CopyToClipboardButton } from "components/CopyToClipboardButton";
import { IBeacon } from "entities/IBeacon";
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

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const handleChange = (event: React.ChangeEvent<{}>, tab: number) => {
    setSelectedTab(tab);
  };

  const [beacon, setBeacon] = useState<IBeacon>({} as IBeacon);
  const [notes, setNotes] = useState<INote[]>([] as INote[]);

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

  const deleteBeaconButton =
    beacon.status.trim().toUpperCase() === "DELETED" ? (
      <span></span>
    ) : (
      <span className="delete-record">
        <Button
          href={`/backoffice#/delete/${beaconId}`}
          variant="outlined"
          color="error"
        >
          Delete record
        </Button>
      </span>
    );

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
        <div className="print-buttons">
          <span className={classes.button}>
            <Button
              href={`/backoffice#/certificates/${beaconId}`}
              variant="outlined"
              startIcon={<ContentPrintIcon />}
            >
              certificate
            </Button>
          </span>
          <span className={classes.button}>
            <Button
              href={`/backoffice#/letters/registration/${beaconId}`}
              variant="outlined"
              startIcon={<ContentPrintIcon />}
            >
              Registration letter
            </Button>
          </span>
          <span className={classes.button}>
            <Button
              href={`/backoffice#/letters/amended/${beaconId}`}
              variant="outlined"
              startIcon={<ContentPrintIcon />}
            >
              Amended letter
            </Button>
          </span>
          <span className={classes.button}>
            <Button
              href={`/backoffice#/label/${beaconId}`}
              variant="outlined"
              startIcon={<ContentPrintIcon />}
            >
              Label
            </Button>
          </span>
        </div>
        {deleteBeaconButton}
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
      </PageContent>
    </div>
  );
};
