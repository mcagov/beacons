import {
  Box,
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { FunctionComponent } from "react";
import { TabulatedRow } from "../../components/dataPanel/TabulatedRow";
import { IAccountHolder } from "../../entities/IAccountHolder";
import countriesJson from "../../lib/countries/countries.json";

import { Placeholders, WritingStyle } from "../../utils/writingStyle";
import { TabulatedRowEditField } from "views/TabulatedRowEditField";

export const AccountHolderSummaryEdit: FunctionComponent<{
  accountHolder: IAccountHolder;
  onSave: (accountHolder: IAccountHolder) => void;
  onCancel: () => void;
}> = ({ accountHolder, onSave, onCancel }) => {
  return (
    <Formik
      initialValues={accountHolder}
      onSubmit={(
        values: IAccountHolder,
        { setSubmitting }: FormikHelpers<IAccountHolder>
      ) => {
        onSave(values);
        setSubmitting(false);
      }}
    >
      {({ values, setValues, initialValues }) => (
        <Form>
          <Grid container direction="row" justifyContent={"flex-start"}>
            <Grid item xs={12} sm={6}>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TabulatedRowEditField
                      label={"Full Name"}
                      fieldName={"fullName"}
                      type={"string"}
                    />
                    <TabulatedRowEditField
                      label={"Telephone Number"}
                      fieldName={"telephoneNumber"}
                      type={"string"}
                    />
                    <TabulatedRowEditField
                      label={"Alternative Telephone Number"}
                      fieldName={"alternativeTelephoneNumber"}
                      type={"string"}
                    />

                    <TabulatedRowEditField
                      label={"Address Line 1"}
                      fieldName={"addressLine1"}
                      type={"string"}
                    />
                    <TabulatedRowEditField
                      label={"Address Line 2"}
                      fieldName={"addressLine2"}
                      type={"string"}
                    />
                    <TabulatedRowEditField
                      label={"Address Line 3"}
                      fieldName={"addressLine3"}
                      type={"string"}
                    />
                    <TabulatedRowEditField
                      label={"Address Line 4"}
                      fieldName={"addressLine4"}
                      type={"string"}
                    />

                    <TabulatedRowEditField
                      label={"Town / City"}
                      fieldName={"townOrCity"}
                      type={"string"}
                    />
                    <TabulatedRowEditField
                      label={"County"}
                      fieldName={"county"}
                      type={"string"}
                    />
                    <TabulatedRowEditField
                      label={"Postcode"}
                      fieldName={"postcode"}
                      type={"string"}
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="country">
                          <Typography>
                            {"Country" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          id="country"
                          as="select"
                          name="country"
                          style={{ minWidth: 330 }}
                        >
                          <option value="">{Placeholders.NoData}</option>
                          {Object.values(countriesJson).map(
                            (country: string, index) => {
                              return (
                                <option key={index} value={country}>
                                  {country}
                                </option>
                              );
                            }
                          )}
                        </Field>
                      }
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Divider />
            <Box mt={2} mr={2}>
              <Button
                name="save"
                type="submit"
                color="secondary"
                variant="contained"
                disableElevation
              >
                Save
              </Button>
            </Box>
            <Box mt={2}>
              <Button onClick={onCancel}>Cancel</Button>
            </Box>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
