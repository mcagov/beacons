import React from "react";
import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { Divider, Grid, Typography } from "@mui/material";

export function Owner({
  beaconOwner,
}: Pick<BeaconSearchResult, "beaconOwner">): JSX.Element {
  return (
    <React.Fragment>
      <Divider sx={{ marginTop: "1rem" }} />
      <Typography
        gutterBottom={true}
        component={"p"}
        variant={"subtitle2"}
        id="settings-search-mode"
      >
        Owner
      </Typography>
      <Grid container spacing={1} sm>
        <Field name={"Name:"} value={beaconOwner.ownerName} />
      </Grid>
    </React.Fragment>
  );
}

function Field({
  name,
  value,
}: {
  name: string;
  value: string;
}): JSX.Element | null {
  if (value.length == null) {
    return null;
  }

  return (
    <React.Fragment>
      <Grid item xs={6}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>{value}</Typography>
      </Grid>
    </React.Fragment>
  );
}
