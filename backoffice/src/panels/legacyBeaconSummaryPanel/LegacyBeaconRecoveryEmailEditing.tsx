import React, { FunctionComponent } from "react";
import { ILegacyBeacon } from "../../entities/ILegacyBeacon";
import { formatLegacyOwners, formatLegacyUses } from "../../utils/writingStyle";
import { FieldValueTypes } from "../../components/dataPanel/FieldValue";
import { Field, Form, Formik, FormikHelpers } from "formik";
import {
  Button,
  Grid,
  Input,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { TabulatedRow } from "components/dataPanel/TabulatedRow";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";

export const LegacyBeaconRecoveryEmailEditing: FunctionComponent<{
  legacyBeacon: ILegacyBeacon;
  onSave: (recoveryEmail: string) => void;
  onCancel: () => void;
}> = ({ legacyBeacon, onSave, onCancel }) => {
  return (
    <Formik
      initialValues={legacyBeacon}
      onSubmit={(
        values: ILegacyBeacon,
        { setSubmitting }: FormikHelpers<ILegacyBeacon>
      ) => {
        console.log(values.recoveryEmail);
        onSave(values.recoveryEmail);
        setSubmitting(false);
      }}
    >
      {({ values, setValues, initialValues }) => (
        <Form>
          <Grid container direction="row" justifyContent={"flex-start"}>
            <Grid item xs={12} sm={6}>
              <PanelViewingState
                columns={1}
                fields={[
                  {
                    key: "Beacon status",
                    value: legacyBeacon?.beaconStatus,
                  },
                  {
                    key: "Manufacturer",
                    value: legacyBeacon?.manufacturer,
                  },
                  {
                    key: "Model",
                    value: legacyBeacon?.model,
                  },
                  {
                    key: "Manufacturer serial number",
                    value: legacyBeacon?.manufacturerSerialNumber,
                  },
                  {
                    key: "Serial number",
                    value: legacyBeacon?.serialNumber?.toString(),
                  },
                  {
                    key: "Beacon type",
                    value: legacyBeacon?.beaconType,
                  },
                  {
                    key: "Coding",
                    value: legacyBeacon?.coding,
                  },
                  {
                    key: "Protocol",
                    value: legacyBeacon?.protocol,
                  },
                  {
                    key: "CSTA",
                    value: legacyBeacon?.csta,
                  },
                  {
                    key: "MTI",
                    value: legacyBeacon?.mti,
                  },
                  {
                    key: "Battery expiry date",
                    value: legacyBeacon?.batteryExpiryDate,
                  },
                  {
                    key: "Last serviced date",
                    value: legacyBeacon?.lastServiceDate,
                  },
                  {
                    key: "First registration date",
                    value: legacyBeacon?.firstRegistrationDate,
                  },
                  {
                    key: "Created date",
                    value: legacyBeacon?.createdDate,
                  },
                  {
                    key: "Last modified date",
                    value: legacyBeacon.lastModifiedDate,
                  },
                  {
                    key: "Cospas sarsat serial number",
                    value: legacyBeacon?.cospasSarsatNumber?.toString(),
                  },
                  {
                    key: "Department reference",
                    value: legacyBeacon?.departRefId,
                  },
                  {
                    key: "Is withdrawn",
                    value: legacyBeacon?.isWithdrawn,
                  },
                  {
                    key: "Withdrawn reason",
                    value: legacyBeacon?.withdrawnReason,
                  },
                  {
                    key: "Owner(s)",
                    value: formatLegacyOwners(
                      legacyBeacon.owner || [],
                      ...(legacyBeacon.secondaryOwners || [])
                    ),
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PanelViewingState
                columns={1}
                fields={[
                  {
                    key: "Emergency contacts",
                    value: legacyBeacon?.emergencyContact?.details,
                    valueType: FieldValueTypes.MULTILINE,
                  },
                  {
                    key: "Registered uses",
                    value: formatLegacyUses(legacyBeacon?.uses || []),
                  },
                  {
                    key: "Notes",
                    value: legacyBeacon?.note || "",
                    valueType: FieldValueTypes.MULTILINE,
                  },
                ]}
              />
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="recoveryEmail">
                          <Typography>{"Recovery email"}</Typography>
                        </label>
                      }
                      value={
                        <>
                          <Field
                            as={Input}
                            id="recoveryEmail"
                            name="recoveryEmail"
                            type="string"
                            multiline
                            fullWidth
                            rows={2}
                            data-testid="textarea-form-field"
                            placeholder="Add your text here"
                            defaultValue={legacyBeacon.recoveryEmail}
                            // error={props.touched && errors.text}
                            // helperText={props.touched && errors.text}
                          ></Field>
                          <Button
                            name="save"
                            type="submit"
                            color="secondary"
                            data-testid="save"
                            variant="contained"
                            // disabled={isSubmitting || !!errors.text}
                          >
                            Save
                          </Button>
                          <Button
                            name="cancel"
                            onClick={onCancel}
                            data-testid="cancel"
                          >
                            Cancel
                          </Button>
                        </>
                      }
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
