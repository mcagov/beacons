import { Card, CardContent, CardHeader } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FieldValueTypes } from "../../components/dataPanel/FieldValue";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { LoadingState } from "../../components/dataPanel/PanelLoadingState";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";
import { IAccountHolder } from "../../entities/IAccountHolder";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { Placeholders } from "../../utils/writingStyle";

interface AccountHolderSummaryPanelProps {
  beaconsGateway: IBeaconsGateway;
  beaconId: string;
}

export const AccountHolderPanel: FunctionComponent<
  AccountHolderSummaryPanelProps
> = ({ beaconsGateway, beaconId }) => {
  const [accountHolder, setAccountHolder] = useState<IAccountHolder>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchBeacon = async (id: string) => {
      try {
        setLoading(true);
        const beacon = await beaconsGateway.getBeacon(id);
        if (beacon?.accountHolder !== null) {
          setAccountHolder(beacon.accountHolder);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchBeacon(beaconId);
  }, [beaconId, beaconsGateway]);

  if (!accountHolder) {
    return (
      <Card>
        <CardContent>
          <CardHeader title="No account holder associated" />
          <>
            {error && <ErrorState message={Placeholders.UnspecifiedError} />}
            {loading && <LoadingState />}
          </>
        </CardContent>
      </Card>
    );
  }

  const fields = [
    { key: "Name", value: accountHolder?.fullName },
    { key: "Telephone", value: accountHolder?.telephoneNumber },
    {
      key: "Alternative Telephone",
      value: accountHolder?.alternativeTelephoneNumber,
    },
    { key: "Email", value: accountHolder?.email },
    {
      key: "Address",
      value: [
        accountHolder?.addressLine1,
        accountHolder?.addressLine2,
        accountHolder?.addressLine3,
        accountHolder?.addressLine4,
        accountHolder?.townOrCity,
        accountHolder?.county,
        accountHolder?.postcode,
        accountHolder?.country || "United Kingdom",
      ],
      valueType: FieldValueTypes.MULTILINE,
    },
  ];

  return (
    <Card>
      <CardContent>
        <CardHeader title="Account Holder" />
        <>
          {error && <ErrorState message={Placeholders.UnspecifiedError} />}
          {loading && <LoadingState />}
          {error || loading || <PanelViewingState fields={fields} />}
        </>
      </CardContent>
    </Card>
  );
};
