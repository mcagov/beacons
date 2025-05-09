import { Card, CardContent, CardHeader } from "@mui/material";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import { FunctionComponent, useEffect, useState } from "react";
import { EditPanelButton } from "../../components/dataPanel/EditPanelButton";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { LoadingState } from "../../components/dataPanel/PanelLoadingState";
import { DataPanelStates } from "../../components/dataPanel/States";
import { IBeacon } from "../../entities/IBeacon";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { diffObjValues } from "../../utils/core";
import { logToServer } from "../../utils/logger";
import { Placeholders } from "../../utils/writingStyle";
import { BeaconSummaryEditing } from "./BeaconSummaryEditing";
import { BeaconSummaryViewing } from "./BeaconSummaryViewing";

interface IBeaconSummaryProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

export const BeaconSummaryPanel: FunctionComponent<IBeaconSummaryProps> = ({
  beaconsGateway,
  beaconId,
}): JSX.Element => {
  const [beacon, setBeacon] = useState<IBeacon>({} as IBeacon);
  const [userState, setUserState] = useState<DataPanelStates>(
    DataPanelStates.Viewing,
  );
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        setError(false);
        setLoading(true);
        const beacon = await beaconsGateway.getBeacon(id);
        setBeacon(beacon);
        setLoading(false);
      } catch (error) {
        logToServer.error(error);
        setError(true);
      }
    };

    fetchBeacon(beaconId);
  }, [userState, beaconId, beaconsGateway]);

  const handleSave = async (updatedBeacon: Partial<IBeacon>): Promise<void> => {
    try {
      await beaconsGateway.updateBeacon(
        beacon.id,
        diffObjValues(beacon, updatedBeacon),
      );
      setUserState(DataPanelStates.Viewing);
    } catch (error) {
      logToServer.error(error);
      setError(true);
    }
  };

  const renderState = (state: DataPanelStates) => {
    switch (state) {
      case DataPanelStates.Viewing:
        return (
          <>
            <OnlyVisibleToUsersWith role={"UPDATE_RECORDS"}>
              <EditPanelButton
                onClick={() => setUserState(DataPanelStates.Editing)}
              >
                Edit summary
              </EditPanelButton>
            </OnlyVisibleToUsersWith>

            <BeaconSummaryViewing beacon={beacon} />
          </>
        );
      case DataPanelStates.Editing:
        return (
          <OnlyVisibleToUsersWith role={"UPDATE_RECORDS"}>
            <BeaconSummaryEditing
              beacon={beacon}
              onSave={handleSave}
              onCancel={() => setUserState(DataPanelStates.Viewing)}
            />
          </OnlyVisibleToUsersWith>
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
          {loading && <LoadingState />}
          {error || loading || renderState(userState)}
        </>
      </CardContent>
    </Card>
  );
};
