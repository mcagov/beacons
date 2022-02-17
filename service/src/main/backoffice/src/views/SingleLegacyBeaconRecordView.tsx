import { Grid, Tab, Tabs } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ILegacyBeacon } from "entities/ILegacyBeacon";
import { LegacyBeaconSummaryPanel } from "panels/legacyBeaconSummaryPanel/LegacyBeaconSummaryPanel";
import { LegacyEmergencyContactPanel } from "panels/legacyEmergencyContactPanel/LegacyEmergencyContactPanel";
import { LegacyOwnerPanel } from "panels/legacyOwnerPanel/LegacyOwnerPanel";
import { LegacyUsesListPanel } from "panels/usesPanel/LegacyUsesListPanel";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../components/layout/PageContent";
import { PageHeader } from "../components/layout/PageHeader";
import { TabPanel } from "../components/layout/TabPanel";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";

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
  })
);

export const SingleLegacyBeaconRecordView: FunctionComponent<ISingleLegacyBeaconRecordViewProps> =
  ({ beaconsGateway, beaconId }): JSX.Element => {
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
          console.error(error);
        }
      };

      fetchBeacon(beaconId);
    }, [beaconId, beaconsGateway]);

    const hexId = beacon?.hexId || "";
    const numberOfUses = beacon?.uses?.length.toString() || "";

    return (
      <div className={classes.root}>
        <PageHeader>Hex ID/UIN: {hexId}</PageHeader>
        <PageContent>
          <LegacyBeaconSummaryPanel legacyBeacon={beacon} />
          <Tabs value={selectedTab} onChange={handleChange}>
            <Tab label="Owner & Emergency Contacts" />
            <Tab label={`${numberOfUses} Registered Uses`} />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <Grid direction="row" container justify="space-between" spacing={1}>
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
