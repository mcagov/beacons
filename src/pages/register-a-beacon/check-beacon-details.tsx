import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLegend,
  Select,
  SelectOption,
} from "../../components/Form";

const CheckBeaconDetails: FunctionComponent = () => (
  <>
    <Layout navigation={<BackButton href="/intent" />}>
      <Grid
        mainContent={
          <>
            <Form action="/register-a-beacon/check-beacon-summary">
              <FormFieldset>
                <FormLegend>Check beacon details</FormLegend>
                <InsetText>
                  The details of your beacon must be checked to ensure they have
                  a UK encoding and if they are already registered with this
                  service.
                </InsetText>

                <Select label="Beacon manufacturer" name="beaconManufacturer">
                  <SelectOption value="Raleigh">Raleigh</SelectOption>
                  <SelectOption value="Giant">Giant</SelectOption>
                  <SelectOption value="Trek">Trek</SelectOption>
                </Select>

                <Select label="Beacon model" name="beaconModel">
                  <SelectOption value="Chopper">Chopper</SelectOption>
                  <SelectOption value="TCR">TCR</SelectOption>
                  <SelectOption value="Madone">Madone</SelectOption>
                </Select>

                <Input
                  label="15 digit beacon HEX ID"
                  name="beaconHexId"
                  spellCheck={false}
                />
              </FormFieldset>
              <Button buttonText="Submit" />
            </Form>
          </>
        }
      />
    </Layout>
  </>
);

export default CheckBeaconDetails;
