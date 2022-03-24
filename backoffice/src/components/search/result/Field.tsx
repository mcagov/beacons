import { Typography } from "@mui/material";
import React from "react";

export function Field({
  name,
  value,
}: {
  name: string;
  value: string | string[] | null;
}): JSX.Element | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    return (
      <React.Fragment>
        <Typography
          gutterBottom={true}
          component={"p"}
          variant={"subtitle2"}
          id="settings-search-mode"
          sx={{ marginTop: "1rem" }}
        >
          {name}
        </Typography>
        <Typography>{value}</Typography>
      </React.Fragment>
    );
  }

  if (value.length === 0) {
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
        {name}
      </Typography>
      {value.map((value, index) => (
        <Typography key={index}>{value}</Typography>
      ))}
    </React.Fragment>
  );
}
