import React, { FunctionComponent } from "react";
import { TextAreaFormSection } from "components/TextAreaFormSection";

export const LegacyBeaconRecoveryEmailEditing: FunctionComponent<{
  currentRecoveryEmail: string;
  onSave: (updatedRecoveryEmail: string) => void;
  onCancel: () => void;
}> = ({ currentRecoveryEmail, onSave, onCancel }) => {
  return (
    <TextAreaFormSection
      submitButtonText="Update recovery email"
      numberOfRowsForTextArea={2}
      initialValue={currentRecoveryEmail}
      textSubmitted={onSave}
      cancelled={onCancel}
    />
  );
  // return (
  //   <Formik
  //     initialValues={legacyBeaconFormValues}
  //     onSubmit={(
  //       values: ILegacyBeaconFormValues,
  //       { setSubmitting }: FormikHelpers<ILegacyBeaconFormValues>
  //     ) => {
  //       onSave(values);
  //       setSubmitting(false);
  //     }}
  //   >
  //     {({ values, setValues, initialValues }) => (
  //       <Form>
  //                       <label htmlFor="recoveryEmail">
  //                         <Typography>
  //                           {"Recovery email"}
  //                         </Typography>
  //                       </label>
  //                     value={
  //                       <Field
  //                         id="recovery-email"
  //                         name="recoveryEmail"
  //                         as="textarea"
  //                         onChange={(
  //                           e: React.ChangeEvent<HTMLSelectElement>
  //                         ) => {
  //                           setValues((values) => ({
  //                             ...values,
  //                             model: "",
  //                             manufacturer: e.target.value,
  //                           }));
  //                         }}
  //                       >
};
