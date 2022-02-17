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
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { FunctionComponent } from "react";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";
import { TabulatedRow } from "../../components/dataPanel/TabulatedRow";
import { BeaconTypes, IBeacon } from "../../entities/IBeacon";
import {
  formatEmergencyContacts,
  formatOwners,
  formatUses,
  Placeholders,
  WritingStyle,
} from "../../utils/writingStyle";
import mtiJson from "../../lib/mti/mtis.json";
import protocolJson from "../../lib/protocol/protocols.json";
import manufacturerModelJson from "../../lib/manufacturerModel/manufacturerModel.json";

export const BeaconSummaryEditing: FunctionComponent<{
  beacon: IBeacon;
  onSave: (beacon: IBeacon) => void;
  onCancel: () => void;
}> = ({ beacon, onSave, onCancel }) => {
  return (
    <Formik
      initialValues={beacon}
      onSubmit={(
        values: IBeacon,
        { setSubmitting }: FormikHelpers<IBeacon>
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
                        <label htmlFor="manufacturer">
                          <Typography>
                            {"Manufacturer" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          id="manufacturer"
                          name="manufacturer"
                          as="select"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setValues((values) => ({
                              ...values,
                              model: "",
                              manufacturer: e.target.value,
                            }));
                          }}
                        >
                          {values.manufacturer ===
                            initialValues.manufacturer && (
                            <option value={initialValues.manufacturer}>
                              {initialValues.manufacturer}
                            </option>
                          )}
                          <option value="">{Placeholders.NoData}</option>
                          {Object.keys(manufacturerModelJson).map(
                            (manufacturer: string) => {
                              return (
                                <option key={manufacturer} value={manufacturer}>
                                  {manufacturer}
                                </option>
                              );
                            }
                          )}
                        </Field>
                      }
                    />
                    <TabulatedRow
                      displayKey={
                        <label htmlFor="model">
                          <Typography>
                            {"Model" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field id="model" name="model" as="select">
                          {values.model === initialValues.model && (
                            <option value={initialValues.model}>
                              {initialValues.model}
                            </option>
                          )}
                          <option value="">{Placeholders.NoData}</option>
                          {(manufacturerModelJson as Record<string, string[]>)[
                            values.manufacturer as string
                          ]?.map((model: string) => {
                            return (
                              <option key={model} value={model}>
                                {model}
                              </option>
                            );
                          })}
                        </Field>
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="manufacturerSerialNumber">
                          <Typography>
                            {"Serial number" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="manufacturerSerialNumber"
                          name="manufacturerSerialNumber"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="chkCode">
                          <Typography>
                            {"CHK code" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="chkCode"
                          name="chkCode"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="beaconType">
                          <Typography>
                            {"Beacon type" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field as="select" name="beaconType">
                          <option value="">{Placeholders.NoData}</option>
                          {Object.values(BeaconTypes).map(
                            (beaconType: string, index) => {
                              return (
                                <option key={index} value={beaconType}>
                                  {beaconType}
                                </option>
                              );
                            }
                          )}
                        </Field>
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="protocol">
                          <Typography>
                            {"Protocol" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          id="protocol"
                          as="select"
                          name="protocol"
                          style={{ minWidth: 330 }}
                        >
                          <option value="">{Placeholders.NoData}</option>
                          {Object.values(protocolJson).map(
                            (protocol: string, index) => {
                              return (
                                <option key={index} value={protocol}>
                                  {protocol}
                                </option>
                              );
                            }
                          )}
                        </Field>
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <Typography>
                          {"Coding" + WritingStyle.KeyValueSeparator}
                        </Typography>
                      }
                      value={
                        <Field
                          as={Input}
                          id="coding"
                          name="coding"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="csta">
                          <Typography>
                            {"CSTA" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="csta"
                          name="csta"
                          type="string"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="mti">
                          <Typography>
                            {"MTI" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          id="mti"
                          as="select"
                          name="mti"
                          style={{ minWidth: 330 }}
                        >
                          <option value="">{Placeholders.NoData}</option>
                          {Object.values(mtiJson).map(
                            (protocol: string, index) => {
                              return (
                                <option key={index} value={protocol}>
                                  {protocol}
                                </option>
                              );
                            }
                          )}
                        </Field>
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="svdr">
                          <Typography>
                            {"SVDR" + WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <>
                          <label>
                            <Field name="svdr" type="radio" value="true" />
                            Yes
                          </label>
                          <label>
                            <Field name="svdr" type="radio" value="false" />
                            No
                          </label>
                        </>
                      }
                    />

                    {/*<TabulatedRow*/}
                    {/*  displayKey={<></>}*/}
                    {/*  value={*/}
                    {/*    <Paper style={{ backgroundColor: "#FFFCC8" }}>*/}
                    {/*      <Box p={1}>*/}
                    {/*        <Typography>*/}
                    {/*          <b>Protocol code</b>, <b>coding method</b> and{" "}*/}
                    {/*          <b>beacon type</b> are automatically derived from*/}
                    {/*          the HEX ID. If you have identified a coding issue,*/}
                    {/*          please flag this record as 'Incorrectly Encoded'*/}
                    {/*          by clicking on the 'Quick Actions' button in the*/}
                    {/*          top right. You can also add any notes in the*/}
                    {/*          'Notes' tab below.*/}
                    {/*        </Typography>*/}
                    {/*      </Box>*/}
                    {/*    </Paper>*/}
                    {/*  }*/}
                    {/*/>*/}

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="batteryExpiryDate">
                          <Typography>
                            {"Battery expiry date" +
                              WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="batteryExpiryDate"
                          name="batteryExpiryDate"
                          type="date"
                          fullWidth
                          placeholder={Placeholders.NoData}
                        />
                      }
                    />

                    <TabulatedRow
                      displayKey={
                        <label htmlFor="lastServicedDate">
                          <Typography>
                            {"Last serviced date" +
                              WritingStyle.KeyValueSeparator}
                          </Typography>
                        </label>
                      }
                      value={
                        <Field
                          as={Input}
                          id="lastServicedDate"
                          name="lastServicedDate"
                          type="date"
                          fullWidth
                        />
                      }
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={6}>
              <PanelViewingState
                columns={1}
                fields={[
                  {
                    key: "Owner(s)",
                    value: formatOwners(beacon.owners),
                  },
                  {
                    key: "Emergency contacts",
                    value: formatEmergencyContacts(beacon.emergencyContacts),
                  },
                  {
                    key: "Registered uses",
                    value: formatUses(beacon.uses),
                  },
                ]}
              />
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
