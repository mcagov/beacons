import { Typography } from "@material-ui/core";
import { FunctionComponent } from "react";
import { formatFieldValue } from "../../utils/writingStyle";

interface IFieldValueProps {
  children: string | undefined;
  valueType?: FieldValueTypes;
}

export enum FieldValueTypes {
  MULTILINE = "MULTILINE",
}

export const FieldValue: FunctionComponent<IFieldValueProps> = ({
  children,
  valueType,
}) => <Typography>{formatFieldValue(children, valueType)}</Typography>;
