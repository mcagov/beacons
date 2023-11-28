import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from "@mui/material";
import { PanelViewingState } from "components/dataPanel/PanelViewingState";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FieldValueTypes } from "../../components/dataPanel/FieldValue";
import { IEmergencyContact } from "../../entities/IEmergencyContact";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { logToServer } from "../../utils/logger";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { IOwner } from "../../entities/IOwner";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { Placeholders } from "../../utils/writingStyle";
import { LoadingState } from "../../components/dataPanel/PanelLoadingState";

interface EmergencyContactPanelProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(0.5),
    },
  })
);

export const EmergencyContactPanel: FunctionComponent<
  EmergencyContactPanelProps
> = ({ beaconsGateway, beaconId }) => {
  const [emergencyContacts, setEmergencyContacts] = useState<
    IEmergencyContact[]
  >([]);
  const classes = useStyles();

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        const beacon = await beaconsGateway.getBeacon(id);
        setEmergencyContacts(beacon.emergencyContacts);
      } catch (error) {
        logToServer.error(error);
      }
    };

    fetchBeacon(beaconId);
  }, [beaconId, beaconsGateway]);

  const fields = emergencyContacts.map((emergencyContact) => [
    { key: "Name", value: emergencyContact.fullName },
    {
      key: "Telephone",
      value: [
        emergencyContact.telephoneNumber,
        emergencyContact.alternativeTelephoneNumber,
      ],
      valueType: FieldValueTypes.MULTILINE,
    },
  ]);

  if (fields.length > 0) {
    return (
      <>
        {fields.map((field, index) => (
          <Paper
            key={index}
            elevation={0}
            variant="outlined"
            className={classes.paper}
          >
            <Typography variant="h6">
              {`Emergency Contact ${index + 1}`}
            </Typography>
            <PanelViewingState fields={field} />
          </Paper>
        ))}
      </>
    );
  } else {
    return <NoEmergencyContacts />;
  }
};

const NoEmergencyContacts = () => (
  <Card>
    <CardContent>
      <CardHeader title="No emergency contacts" />
    </CardContent>
  </Card>
);
