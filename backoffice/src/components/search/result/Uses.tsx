import { Divider, Typography } from "@mui/material";
import React from "react";
import { BeaconSearchResult } from "../../../entities/BeaconSearch";
import { Field } from "./Field";

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
      <UseField
        field={"Aircraft 24-bit address"}
        values={aircraft24bitHexAddresses}
      />
      <UseField
        field={"Aircraft Tail number"}
        values={aircraftRegistrationMarks}
      />
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
      <Field name={"Vessel call sign"} value={vesselCallsigns} />
      <Field name={"Vessel name"} value={vesselNames} />
      <Field name={"Vessel MMSI"} value={vesselMmsiNumbers} />
    </React.Fragment>
  );
}

function UseField({
  field,
  values,
}: {
  field: string;
  values: string[];
}): JSX.Element | null {
  if (values.length === 0) {
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
      {values.map((value, index) => (
        <Typography key={index}>{value}</Typography>
      ))}
    </React.Fragment>
  );
}
