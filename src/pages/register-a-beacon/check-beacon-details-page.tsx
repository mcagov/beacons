import React, { FunctionComponent } from "react";
import Head from "next/head";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";

const CheckBeaconDetailsPage: FunctionComponent = () => (
  <>
    <Head>
      <title>
        Beacon Registration Service - Register a new 406 MHz distress beacon
      </title>
    </Head>
    <Layout>
      <Grid
        mainContent={
          <>
            <form
              action="/register-a-beacon/check-beacon-summary"
              method="POST"
            >
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                  <h1 className="govuk-fieldset__heading">
                    Check beacon details
                  </h1>
                  <InsetText>
                    The details of your beacon must be checked to ensure they
                    have a UK encoding and if they are already registered with
                    this service.
                  </InsetText>
                </legend>

                <div className="govuk-form-group">
                  <label className="govuk-label" htmlFor="beaconManufacturer">
                    Beacon manufacturer
                  </label>
                  <select
                    className="govuk-select"
                    id="beaconManufacturer"
                    name="beaconManufacturer"
                  >
                    <option value="Raleigh">Raleigh</option>
                    <option value="Giant">Giant</option>
                    <option value="Trek">Trek</option>
                  </select>
                </div>

                <div className="govuk-form-group">
                  <label className="govuk-label" htmlFor="beaconModel">
                    Beacon model
                  </label>
                  <select
                    className="govuk-select"
                    id="beaconModel"
                    name="beaconModel"
                  >
                    <option value="Chopper">Chopper</option>
                    <option value="TCR">TCR</option>
                    <option value="Madone">Madone</option>
                  </select>
                </div>

                <div className="govuk-form-group">
                  <label className="govuk-label" htmlFor="beaconHexId">
                    15 digit beacon HEX ID
                  </label>
                  <input
                    className="govuk-input"
                    id="beaconHexId"
                    name="beaconHexId"
                    type="text"
                    spellCheck="false"
                  />
                </div>
              </fieldset>
              <button>Submit</button>
            </form>
          </>
        }
      />
    </Layout>
  </>
);

export default CheckBeaconDetailsPage;
