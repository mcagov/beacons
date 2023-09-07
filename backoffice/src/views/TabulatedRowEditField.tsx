import { Input, Typography } from "@mui/material";
import { TabulatedRow } from "components/dataPanel/TabulatedRow";
import { Field } from "formik";
import { FunctionComponent } from "react";
import { Placeholders, WritingStyle } from "utils/writingStyle";

export const TabulatedRowEditField: FunctionComponent<{
  label: string;
  fieldName: string;
  type: string;
  required?: boolean;
}> = ({ label, fieldName, type, required = false }) => {
  return (
    <TabulatedRow
      displayKey={
        <label htmlFor={fieldName}>
          <Typography>{label + WritingStyle.KeyValueSeparator}</Typography>
        </label>
      }
      value={
        <>
          <Field
            as={Input}
            id={fieldName}
            name={fieldName}
            type={type}
            fullWidth
            placeholder={Placeholders.NoData}
            {...(required ? { required: true } : {})}
          />
        </>
      }
    />
  );
};
