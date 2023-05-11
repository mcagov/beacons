import React, { FunctionComponent } from "react";
import { ILegacyBeacon } from "../../entities/ILegacyBeacon";
import {
  Placeholders,
  formatLegacyOwners,
  formatLegacyUses,
} from "../../utils/writingStyle";
import { FieldValueTypes } from "../../components/dataPanel/FieldValue";
import {
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikProps,
  useFormik,
  withFormik,
} from "formik";
import {
  Button,
  Grid,
  Input,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import { TabulatedRow } from "components/dataPanel/TabulatedRow";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";
import { validate } from "uuid";
import * as Yup from "yup";

const emailValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

// const formik = useFormik({
//     initialValues: {
//       email: 'foobar@example.com',
//       password: 'foobar',
//     },
//     validationSchema: validationSchema,
//     onSubmit: (values) => {
//       alert(JSON.stringify(values, null, 2));
//     },
//   });

interface LegacyBeaconRecoveryEmailChangingProps {
  legacyBeacon: ILegacyBeacon;
  onSave: (recoveryEmail: string) => void;
  onCancel: () => void;
  handleChange: () => void;
}

export const LegacyBeaconRecoveryEmailChanging: FunctionComponent<
  LegacyBeaconRecoveryEmailChangingProps
> = (props: LegacyBeaconRecoveryEmailChangingProps) => {
  const { legacyBeacon, onSave, onCancel, handleChange } = props;
  return (
    <Formik
      initialValues={legacyBeacon}
      validationSchema={emailValidationSchema}
      onSubmit={(
        values: ILegacyBeacon,
        { setSubmitting }: FormikHelpers<ILegacyBeacon>
      ) => {
        console.log(values);
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
                            as={TextField}
                            id="recoveryEmail"
                            name="recoveryEmail"
                            type="string"
                            fullWidth
                            placeholder="Email address"
                            onChange={handleChange}
                          ></Field>
                          <Button
                            name="save"
                            type="submit"
                            color="secondary"
                            data-testid="save"
                            variant="contained"
                            // disabled={isSubmitting || !!errors.recoveryEmail}
                            disabled={legacyBeacon.recoveryEmail ? false : true}
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
