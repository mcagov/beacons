import { Card, CardContent, CardHeader, Grid } from "@material-ui/core";
import { IUse } from "entities/IUse";
import { IUsesGateway } from "gateways/uses/IUsesGateway";
import React, { FunctionComponent, useEffect, useState } from "react";
import { UsePanel } from "./UsePanel";

interface UsesListSummaryPanelProps {
  usesGateway: IUsesGateway;
  beaconId: string;
}

export const UsesListPanel: FunctionComponent<UsesListSummaryPanelProps> = ({
  usesGateway,
  beaconId,
}: UsesListSummaryPanelProps): JSX.Element => {
  const [uses, setUses] = useState<IUse[]>([]);

  useEffect((): void => {
    const fetchUses = async (id: string) => {
      try {
        const uses = await usesGateway.getUses(id);
        setUses(uses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUses(beaconId);
  }, [beaconId, usesGateway]);

  if (uses.length === 0) {
    return (
      <Card>
        <CardContent>
          <CardHeader title="No beacon uses associated" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={2}>
      {uses.map((use, index) => (
        <Grid item xs={6} key={index}>
          <UsePanel use={use} titlePrefix={getTitlePrefix(index + 1)} />
        </Grid>
      ))}
    </Grid>
  );
};

const getTitlePrefix = (index: number): string => {
  const numberToOrdinalString: Record<number, string> = {
    1: "Primary",
    2: "Secondary",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
  };

  return numberToOrdinalString[index];
};
