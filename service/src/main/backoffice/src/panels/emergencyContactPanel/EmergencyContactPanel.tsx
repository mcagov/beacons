import { Card, CardContent, CardHeader } from "@material-ui/core";
import { PanelViewingState } from "components/dataPanel/PanelViewingState";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FieldValueTypes } from "../../components/dataPanel/FieldValue";
import { IEmergencyContact } from "../../entities/IEmergencyContact";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";

interface EmergencyContactPanelProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

export const EmergencyContactPanel: FunctionComponent<EmergencyContactPanelProps> =
  ({ beaconsGateway, beaconId }) => {
    const [emergencyContacts, setEmergencyContacts] = useState<
      IEmergencyContact[]
    >([]);

    useEffect((): void => {
      const fetchBeacon = async (id: string) => {
        try {
          const beacon = await beaconsGateway.getBeacon(id);
          setEmergencyContacts(beacon.emergencyContacts);
        } catch (error) {
          // TODO: Confirm with UCD what user feedback should be displayed if an error has occured when fetching a beacon
          console.error(error);
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
            <Card key={index}>
              <CardContent>
                <CardHeader title={`Emergency Contact ${index + 1}`} />
                <PanelViewingState fields={field} />
              </CardContent>
            </Card>
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
