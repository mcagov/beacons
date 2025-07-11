import React, { FunctionComponent, type JSX } from "react";

interface DataRowItemProps {
  label?: string;
  value?: string;
  noDataValue?: string;
}

export const DataRowItem: FunctionComponent<DataRowItemProps> = ({
  label,
  value,
  noDataValue = "-",
}: DataRowItemProps): JSX.Element => (
  <>
    {label ? label + ": " : ""}
    {value ? value : noDataValue}
    <br />
  </>
);
