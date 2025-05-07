import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React, { FunctionComponent } from "react";
import { IField } from "utils/IField";
import { WritingStyle } from "../../utils/writingStyle";
import { FieldValue } from "./FieldValue";

export interface IPanelViewingStateProps {
  fields: IField[];
  columns?: 1 | 2;
  splitAfter?: number;
}

export const PanelViewingState: FunctionComponent<IPanelViewingStateProps> = ({
  fields,
  columns = 1,
  splitAfter,
}) => {
  switch (columns) {
    case 1:
      return <OneColumn fields={fields} />;
    case 2:
      return <TwoColumns fields={fields} splitAfter={splitAfter} />;
    default:
      throw Error("Unsupported number of columns, max 2");
  }
};

const OneColumn: FunctionComponent<IPanelViewingStateProps> = ({ fields }) => (
  <TableContainer>
    <Table size="small">
      <TableBody>
        {fields.map((field, index) => {
          const valuesAsArray =
            field.value instanceof Array ? field.value : [field.value];
          return (
            <TableRow key={index}>
              <TableCell component="th" scope="row" style={{ width: "30%" }}>
                <Typography>
                  {field.key + WritingStyle.KeyValueSeparator}
                </Typography>
              </TableCell>
              <TableCell>
                {valuesAsArray.map((value, index) => (
                  <FieldValue key={index} valueType={field.valueType}>
                    {value}
                  </FieldValue>
                ))}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

const TwoColumns: FunctionComponent<IPanelViewingStateProps> = ({
  fields,
  splitAfter,
}) => {
  const columnOneFields = fields.slice(0, splitAfter);
  const columnTwoFields = fields.slice(splitAfter);

  return (
    <Grid container>
      <Grid item xs={6}>
        <OneColumn fields={columnOneFields} />
      </Grid>
      <Grid item xs={6}>
        <OneColumn fields={columnTwoFields} />
      </Grid>
    </Grid>
  );
};
