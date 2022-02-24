import { Card, CardContent, CardHeader } from "@material-ui/core";
import { PanelViewingState } from "components/dataPanel/PanelViewingState";
import { ILegacyEmergencyContact } from "entities/ILegacyBeacon";
import React, { FunctionComponent } from "react";

interface LegacyEmergencyContactPanelProps {
  legacyEmergencyContact: ILegacyEmergencyContact;
}

export const LegacyEmergencyContactPanel: FunctionComponent<LegacyEmergencyContactPanelProps> =
  ({ legacyEmergencyContact }) => {
    const fields = [{ key: "Details", value: legacyEmergencyContact?.details }];
    const cardHeader = legacyEmergencyContact
      ? "Emergency contact"
      : "No emergency contacts";

    return (
      <Card>
        <CardContent>
          <CardHeader title={cardHeader} />
          <PanelViewingState fields={fields} />
        </CardContent>
      </Card>
    );
  };
