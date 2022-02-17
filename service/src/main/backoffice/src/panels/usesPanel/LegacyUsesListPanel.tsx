import { Card, CardContent, CardHeader, Grid } from "@material-ui/core";
import { ILegacyUse } from "entities/ILegacyBeacon";
import React, { FunctionComponent } from "react";
import { LegacyUsePanel } from "./LegacyUsePanel";

interface LegacyUsesListSummaryPanelProps {
  uses: ILegacyUse[];
}

export const LegacyUsesListPanel: FunctionComponent<LegacyUsesListSummaryPanelProps> =
  ({ uses }: LegacyUsesListSummaryPanelProps): JSX.Element => {
    if (!uses) {
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
            <LegacyUsePanel use={use} titlePrefix={getTitlePrefix(index + 1)} />
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
