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

interface ILegacyBeaconSummaryProps {
  legacyBeacon: ILegacyBeacon;
}

export const LegacyBeaconSummaryPanel: FunctionComponent<
  ILegacyBeaconSummaryProps
> = ({ legacyBeacon }): JSX.Element => {
  const [userState, setUserState] = useState<DataPanelStates>(
    DataPanelStates.Viewing
  );
  const [error, setError] = useState(false);

  useEffect((): void => {
    setUserState(DataPanelStates.Viewing);
  }, [userState, legacyBeacon]);

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
            <LegacyBeaconRecoveryEmailEditing
              recoveryEmail={legacyBeacon.recoveryEmail}
            />
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
