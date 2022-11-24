import { Button, Grid, Tab, Tabs } from "@mui/material";
import ContentPrintIcon from "@mui/icons-material/Print";
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

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const handleChange = (event: React.ChangeEvent<{}>, tab: number) => {
    setSelectedTab(tab);
  };

  const [beacon, setBeacon] = useState<ILegacyBeacon>({} as ILegacyBeacon);

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
              endIcon={<ContentPrintIcon />}
            >
              certificate
            </Button>
          </span>
          <span className={classes.button}>
            <Button
              href={`/backoffice#/letters/registration/${beaconId}`}
              variant="outlined"
              endIcon={<ContentPrintIcon />}
            >
              Registration letter
            </Button>
          </span>
          <span className={classes.button}>
            <Button
              href={`/backoffice#/letters/amended/${beaconId}`}
              variant="outlined"
              endIcon={<ContentPrintIcon />}
            >
              Amended letter
            </Button>
          </span>
          <span className={classes.button}>
            <Button
              href={`/backoffice#/label/${beaconId}`}
              variant="outlined"
              endIcon={<ContentPrintIcon />}
            >
              Label
            </Button>
          </span>
        </div>
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
      </PageContent>
    </div>
  );
};
