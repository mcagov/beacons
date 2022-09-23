import { FieldValueTypes } from "components/dataPanel/FieldValue";

type IFieldValue = string | undefined;

export interface IField {
  key: string;
  value: IFieldValue | IFieldValue[];
  valueType?: FieldValueTypes;
}
