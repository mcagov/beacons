import { Card, CardContent, CardHeader } from "@material-ui/core";
import { FunctionComponent, useEffect, useState } from "react";
import { EditPanelButton } from "../../components/dataPanel/EditPanelButton";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { LoadingState } from "../../components/dataPanel/PanelLoadingState";
import { DataPanelStates } from "../../components/dataPanel/States";
import { IBeacon } from "../../entities/IBeacon";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { diffObjValues } from "../../utils/core";
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
    DataPanelStates.Viewing
  );
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        setLoading(true);
        const beacon = await beaconsGateway.getBeacon(id);
        setBeacon(beacon);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchBeacon(beaconId);
  }, [userState, beaconId, beaconsGateway]);

  const handleSave = async (updatedBeacon: Partial<IBeacon>): Promise<void> => {
    try {
      await beaconsGateway.updateBeacon(
        beacon.id,
        diffObjValues(beacon, updatedBeacon)
      );
      setUserState(DataPanelStates.Viewing);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const renderState = (state: DataPanelStates) => {
    switch (state) {
      case DataPanelStates.Viewing:
        return (
          <>
            <EditPanelButton
              onClick={() => setUserState(DataPanelStates.Editing)}
            >
              Edit summary
            </EditPanelButton>
            <BeaconSummaryViewing beacon={beacon} />
          </>
        );
      case DataPanelStates.Editing:
        return (
          <BeaconSummaryEditing
            beacon={beacon}
            onSave={handleSave}
            onCancel={() => setUserState(DataPanelStates.Viewing)}
          />
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
