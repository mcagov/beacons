import { Divider } from "@mui/material";
import React from "react";
import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { Field } from "./Field";

export function Owner({
  beaconOwner,
}: Pick<BeaconSearchResult, "beaconOwner">): JSX.Element | null {
  if (beaconOwner == null) {
    return null;
  }
  return (
    <React.Fragment>
      <Divider sx={{ marginTop: "1rem" }} />
      <Field name={"Owner Name"} value={beaconOwner.ownerName} />
    </React.Fragment>
  );
}
