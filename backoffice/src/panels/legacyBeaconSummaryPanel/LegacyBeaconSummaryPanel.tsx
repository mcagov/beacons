import { Card, CardContent, CardHeader } from "@mui/material";
import { ILegacyBeacon } from "entities/ILegacyBeacon";
import { FunctionComponent, useEffect, useState } from "react";
import { Placeholders } from "utils/writingStyle";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { DataPanelStates } from "../../components/dataPanel/States";
import { LegacyBeaconSummaryViewing } from "./LegacyBeaconSummaryViewing";
import { LegacyBeaconRecoveryEmailViewing } from "./LegacyBeaconRecoveryEmailViewing";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import { EditPanelButton } from "components/dataPanel/EditPanelButton";
import { LegacyBeaconRecoveryEmailEditing } from "./LegacyBeaconRecoveryEmailEditing";
import { ILegacyBeaconsGateway } from "gateways/legacy-beacons/ILegacyBeaconsGateway";
import { logToServer } from "../../utils/logger";

interface ILegacyBeaconSummaryProps {
  legacyBeaconId: string;
  legacyBeaconsGateway: ILegacyBeaconsGateway;
}

export const LegacyBeaconSummaryPanel: FunctionComponent<
  ILegacyBeaconSummaryProps
> = ({ legacyBeaconId, legacyBeaconsGateway }): JSX.Element => {
  const [userState, setUserState] = useState<DataPanelStates>(
    DataPanelStates.Viewing
  );
  const [error, setError] = useState(false);
  const [legacyBeacon, setLegacyBeacon] = useState<ILegacyBeacon>(
    {} as ILegacyBeacon
  );

  useEffect(() => {
    const fetchLegacyBeacon = async (id: string) => {
      try {
        setError(false);
        const beacon = await legacyBeaconsGateway.getLegacyBeacon(id);
        setLegacyBeacon(beacon);
      } catch (error) {
        logToServer.error(error);
        setError(true);
      }
    };

    fetchLegacyBeacon(legacyBeaconId);
  }, [userState, legacyBeaconId, legacyBeaconsGateway]);

  const handleSaveRecoveryEmail = async (updatedRecoveryEmail: string) => {
    try {
      await legacyBeaconsGateway.updateRecoveryEmail(
        legacyBeacon.id,
        updatedRecoveryEmail
      );
      console.log("New recovery email: " + updatedRecoveryEmail);
      setUserState(DataPanelStates.Viewing);
    } catch (err) {
      logToServer.error(err);
      setError(true);
    }
  };

  const handleCancelRecoveryEmail = () => {
    setUserState(DataPanelStates.Viewing);
    console.log("Cancelled");
  };

  const renderState = (state: DataPanelStates) => {
    switch (state) {
      case DataPanelStates.Viewing:
        return (
          <>
            <LegacyBeaconSummaryViewing legacyBeacon={legacyBeacon} />
            <OnlyVisibleToUsersWith role={"UPDATE_RECORDS"}>
              <EditPanelButton
                onClick={() => setUserState(DataPanelStates.Editing)}
              >
                Edit recovery email
              </EditPanelButton>
            </OnlyVisibleToUsersWith>
            <LegacyBeaconRecoveryEmailViewing
              recoveryEmail={legacyBeacon.recoveryEmail}
            />
          </>
        );
      case DataPanelStates.Editing:
        return (
          <>
            <LegacyBeaconSummaryViewing legacyBeacon={legacyBeacon} />
            <OnlyVisibleToUsersWith role={"UPDATE_RECORDS"}>
              <LegacyBeaconRecoveryEmailEditing
                currentRecoveryEmail={legacyBeacon.recoveryEmail}
                onSave={handleSaveRecoveryEmail}
                onCancel={handleCancelRecoveryEmail}
              />
            </OnlyVisibleToUsersWith>
          </>
        );
      default:
        setError(true);
    }
  };

  return (
    <Card>
      <CardContent>
        <CardHeader title="Summary" />
        <>
          {error && <ErrorState message={Placeholders.UnspecifiedError} />}
          {error || renderState(userState)}
        </>
      </CardContent>
    </Card>
  );
};
