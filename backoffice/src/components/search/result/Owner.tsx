import React from "react";
import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { Divider, Typography } from "@mui/material";

export function Owner({
  beaconOwner,
}: Pick<BeaconSearchResult, "beaconOwner">): JSX.Element {
  return (
    <React.Fragment>
      <Divider sx={{ marginTop: "1rem" }} />
      <Field field={"Owner Name"} value={beaconOwner.ownerName} />
    </React.Fragment>
  );
}

function Field({
  field,
  value,
}: {
  field: string;
  value: string;
}): JSX.Element | null {
  if (value.length == null) {
    return null;
  }

  return (
    <React.Fragment>
      <Typography
        gutterBottom={true}
        component={"p"}
        variant={"subtitle2"}
        id="settings-search-mode"
        sx={{ marginTop: "1rem" }}
      >
        {field}
      </Typography>
      <Typography>{value}</Typography>
    </React.Fragment>
  );
}
