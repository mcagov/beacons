import { TableCell, TableRow } from "@material-ui/core";
import React, { FunctionComponent } from "react";

export const TabulatedRow: FunctionComponent<{
  displayKey: JSX.Element;
  value: JSX.Element;
}> = ({ displayKey, value }) => (
  <TableRow>
    <TableCell component="th" scope="row">
      {displayKey}
    </TableCell>
    <TableCell>{value}</TableCell>
  </TableRow>
);
