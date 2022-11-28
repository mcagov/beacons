import { Button, Grid, Tab, Tabs } from "@mui/material";
import ContentPrintIcon from "@mui/icons-material/Print";
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
import { BeaconDeletionReasons } from "lib/BeaconDeletionReasons";

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
  const reasonsForLegacyDeletion: string[] | undefined = Object.values(
    BeaconDeletionReasons
  );

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
        accountHolderId: "",
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
          dialogueTitle="Are you sure you want to permanently delete this migrated record?"
          dialogueContentText="This will delete the beacon record, its owner(s), and all other associated information."
          action="Yes"
          dismissal="No"
          selectOption={handleDeleteDialogueAction}
          reasonsForAction={reasonsForLegacyDeletion}
        />
      </PageContent>
    </div>
  );
};
