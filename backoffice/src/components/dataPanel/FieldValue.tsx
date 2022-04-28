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
}) => formatFieldValue(children, valueType);
