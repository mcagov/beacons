import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { FunctionComponent } from "react";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";
import { TabulatedRow } from "../../components/dataPanel/TabulatedRow";
import { IAccountHolder } from "../../entities/IAccountHolder";
import countriesJson from "../../lib/countries/countries.json";

import { Placeholders, WritingStyle } from "../../utils/writingStyle";

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
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="fullName">
                          <Typography>
                            {"Full name" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="telephoneNumber">
                          <Typography>
                            {"Telephone Number" +
                              WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="telephoneNumber"
                          name="telephoneNumber"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="alternativeTelephoneNumber">
                          <Typography>
                            {"Alternative Telephone Number" +
                              WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="alternativeTelephoneNumber"
                          name="alternativeTelephoneNumber"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="email">
                          <Typography>
                            {"Email Address" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="addressLine1">
                          <Typography>
                            {"Address Line 1" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="addressLine1"
                          name="addressLine1"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="addressLine2">
                          <Typography>
                            {"Address Line 2" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="addressLine2"
                          name="addressLine2"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="addressLine3">
                          <Typography>
                            {"Address Line 3" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="addressLine3"
                          name="addressLine3"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="addressLine4">
                          <Typography>
                            {"Address Line 4" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="addressLine4"
                          name="addressLine4"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="townOrCity">
                          <Typography>
                            {"Town / City" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="townOrCity"
                          name="townOrCity"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="county">
                          <Typography>
                            {"County" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="county"
                          name="county"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="postcode">
                          <Typography>
                            {"Postcode" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="postcode"
                          name="postcode"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
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
