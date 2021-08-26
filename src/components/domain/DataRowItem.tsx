import React, { FunctionComponent } from "react";

interface DataRowItemProps {
  label?: string;
  value?: string;
}
const noData = "-";

export const DataRowItem: FunctionComponent<DataRowItemProps> = ({
  label,
  value,
}: DataRowItemProps): JSX.Element => (
  <>
    {label ? label + ": " : ""}
    {value ? value : noData}
    <br />
  </>
);
