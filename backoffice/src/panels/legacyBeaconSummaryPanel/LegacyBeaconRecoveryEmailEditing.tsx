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

interface LegacyBeaconRecoveryEmailFormProps
  extends FormikProps<ILegacyBeacon> {
  legacyBeacon: ILegacyBeacon;
  onSave: (recoveryEmail: string) => void;
  onCancel: () => void;
}

export const LegacyBeaconRecoveryEmailForm: FunctionComponent<
  LegacyBeaconRecoveryEmailFormProps
> = (props: LegacyBeaconRecoveryEmailFormProps) => {
  const { errors, isSubmitting, legacyBeacon, onSave, onCancel } = props;
  return (
    <Formik
      initialValues={legacyBeacon}
      onSubmit={(
        values: ILegacyBeacon,
        { setSubmitting }: FormikHelpers<ILegacyBeacon>
      ) => {
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
                            onChange={validate}
                            validate={validate}
                            // defaultValue={legacyBeacon.recoveryEmail? legacyBeacon.recoveryEmail : ""}
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

export const LegacyBeaconRecoveryEmailEditing = withFormik<
  {
    legacyBeacon: ILegacyBeacon;
    onSave: (recoveryEmail: string) => void;
    onCancel: () => void;
  },
  ILegacyBeacon
>({
  mapPropsToErrors: () => {
    return {
      recoveryEmail: "Required",
    };
  },

  validate: (legacyBeacon: ILegacyBeacon) => {
    console.log(legacyBeacon.recoveryEmail);
    let errors: FormikErrors<ILegacyBeacon> = {};
    if (!legacyBeacon.recoveryEmail) {
      console.log("recovery email required");
      errors.recoveryEmail = "Required";
    }
    if (legacyBeacon.recoveryEmail) {
      errors.recoveryEmail = legacyBeacon.recoveryEmail
        ? "Invalid text"
        : undefined;
    }
    return errors;
  },

  handleSubmit: (legacyBeacon: ILegacyBeacon, { setSubmitting, props }) => {
    props.onSave(legacyBeacon.recoveryEmail);
    setSubmitting(false);
  },
})(LegacyBeaconRecoveryEmailForm);
