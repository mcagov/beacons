import { Card, CardContent, CardHeader } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FieldValueTypes } from "../../components/dataPanel/FieldValue";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { LoadingState } from "../../components/dataPanel/PanelLoadingState";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";
import { IOwner } from "../../entities/IOwner";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { Placeholders } from "../../utils/writingStyle";

interface OwnerSummaryPanelProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

export const OwnerPanel: FunctionComponent<OwnerSummaryPanelProps> = ({
  beaconsGateway,
  beaconId,
}) => {
  const [owner, setOwner] = useState<IOwner>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        setLoading(true);
        const beacon = await beaconsGateway.getBeacon(id);
        if (beacon?.owners?.length !== 0) {
          setOwner(beacon.owners[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchBeacon(beaconId);
  }, [beaconId, beaconsGateway]);

  if (!owner) {
    return (
      <Card>
        <CardContent>
          <CardHeader title="No owner associated" />
          <>
            {error && <ErrorState message={Placeholders.UnspecifiedError} />}
            {loading && <LoadingState />}
          </>
        </CardContent>
      </Card>
    );
  }

  const fields = [
    { key: "Name", value: owner?.fullName },
    { key: "Telephone", value: owner?.telephoneNumber },
    { key: "Email", value: owner?.email },
    {
      key: "Address",
      value: [
        owner?.addressLine1,
        owner?.addressLine2,
        owner?.townOrCity,
        owner?.county,
        owner?.postcode,
      ],
      valueType: FieldValueTypes.MULTILINE,
    },
  ];

  return (
    <Card>
      <CardContent>
        <CardHeader title="Owner" />
        <>
          {error && <ErrorState message={Placeholders.UnspecifiedError} />}
          {loading && <LoadingState />}
          {error || loading || <PanelViewingState fields={fields} />}
        </>
      </CardContent>
    </Card>
  );
};
