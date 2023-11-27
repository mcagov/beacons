import { Card, CardContent, CardHeader, Grid } from "@mui/material";
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

export const OwnersPanel: FunctionComponent<OwnerSummaryPanelProps> = ({
  beaconsGateway,
  beaconId,
}) => {
  const [owners, setOwners] = useState<IOwner[]>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        setLoading(true);
        const beacon = await beaconsGateway.getBeacon(id);
        if (beacon?.owners?.length !== 0) {
          setOwners(beacon.owners);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchBeacon(beaconId);
  }, [beaconId, beaconsGateway]);

  if (!owners) {
    return (
      <Card>
        <CardContent>
          <CardHeader title="No owners associated" />
          <>
            {error && <ErrorState message={Placeholders.UnspecifiedError} />}
            {loading && <LoadingState />}
          </>
        </CardContent>
      </Card>
    );
  }

  function fields(owner: IOwner) {
    return [
      { key: "Name", value: owner?.fullName },
      { key: "Telephone", value: owner?.telephoneNumber },
      {
        key: "Alternative Telephone",
        value: owner?.alternativeTelephoneNumber,
      },
      { key: "Email", value: owner?.email },
      {
        key: "Address",
        value: [
          owner?.addressLine1,
          owner?.addressLine2,
          owner?.addressLine3,
          owner?.addressLine4,
          owner?.townOrCity,
          owner?.county,
          owner?.postcode,
          owner?.country || "United Kingdom",
        ],
        valueType: FieldValueTypes.MULTILINE,
      },
      { key: "Primary Owner", value: owner?.isMain ? "Yes" : "No" },
    ];
  }

  return (
    <>
      {owners.map((owner: IOwner, index) => (
        <Grid item xs={6} key={index}>
          <Card>
            <CardContent>
              <CardHeader
                title={`${owner.isMain ? "Primary " : ""}Owner : ${
                  owner?.fullName
                }`}
              />
              <>
                {error && (
                  <ErrorState message={Placeholders.UnspecifiedError} />
                )}
                {loading && <LoadingState />}
                {error || loading || (
                  <PanelViewingState fields={fields(owner)} />
                )}
              </>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};
