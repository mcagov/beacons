import React from "react";
import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { Divider, Grid, Typography } from "@mui/material";

export function Uses({
  vesselCallsigns,
  vesselMmsiNumbers,
  vesselNames,
  aircraft24bitHexAddresses,
  aircraftRegistrationMarks,
}: Pick<
  BeaconSearchResult,
  | "vesselNames"
  | "vesselCallsigns"
  | "vesselMmsiNumbers"
  | "aircraft24bitHexAddresses"
  | "aircraftRegistrationMarks"
>): JSX.Element {
  return (
    <React.Fragment>
      <Aviation
        aircraftRegistrationMarks={aircraftRegistrationMarks}
        aircraft24bitHexAddresses={aircraft24bitHexAddresses}
      />
      <Maritime
        vesselMmsiNumbers={vesselMmsiNumbers}
        vesselNames={vesselNames}
        vesselCallsigns={vesselCallsigns}
      />
    </React.Fragment>
  );
}

function Aviation({
  aircraft24bitHexAddresses,
  aircraftRegistrationMarks,
}: Pick<
  BeaconSearchResult,
  "aircraft24bitHexAddresses" | "aircraftRegistrationMarks"
>): JSX.Element | null {
  if (
    aircraftRegistrationMarks.length === 0 &&
    aircraft24bitHexAddresses.length === 0
  ) {
    return null;
  }

  return (
    <React.Fragment>
      <Divider sx={{ marginTop: "1rem" }} />
      <Typography
        gutterBottom={true}
        component={"p"}
        variant={"subtitle2"}
        id="settings-search-mode"
      >
        Aviation
      </Typography>
      <Grid container spacing={1} sm>
        <UseField name={"24-bit address:"} values={aircraft24bitHexAddresses} />
        <UseField name={"Tail number:"} values={aircraftRegistrationMarks} />
      </Grid>
    </React.Fragment>
  );
}

function Maritime({
  vesselCallsigns,
  vesselNames,
  vesselMmsiNumbers,
}: Pick<
  BeaconSearchResult,
  "vesselCallsigns" | "vesselNames" | "vesselMmsiNumbers"
>): JSX.Element | null {
  if (
    vesselCallsigns.length === 0 &&
    vesselNames.length === 0 &&
    vesselMmsiNumbers.length === 0
  ) {
    return null;
  }

  return (
    <React.Fragment>
      <Divider sx={{ marginTop: "1rem" }} />
      <Typography
        gutterBottom={true}
        component={"p"}
        variant={"subtitle2"}
        id="settings-search-mode"
      >
        Maritime
      </Typography>
      <Grid container spacing={1} sm>
        <UseField name={"Call sign:"} values={vesselCallsigns} />
        <UseField name={"Vessel name:"} values={vesselNames} />
        <UseField name={"MMSI:"} values={vesselMmsiNumbers} />
      </Grid>
    </React.Fragment>
  );
}

function UseField({
  name,
  values,
}: {
  name: string;
  values: string[];
}): JSX.Element | null {
  if (values.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      <Grid item xs={6}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>{values}</Typography>
      </Grid>
    </React.Fragment>
  );
}
