import React, { FunctionComponent } from "react";
import Head from "next/head";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";

const CheckBeaconDetails: FunctionComponent = () => (
  <>
    <Head>
      <title>
        Beacon Registration Service - Register a new 406 MHz distress beacon
      </title>
    </Head>

    <Grid
      mainContent={
        <>
          <form action="/register-a-beacon/check-beacon-summary" method="POST">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                <h1 className="govuk-fieldset__heading">
                  Check beacon details
                </h1>
                <InsetText>
                  The details of your beacon must be checked to ensure they have
                  a UK encoding and if they are already registered with this
                  service.
                </InsetText>
              </legend>

              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="beacon-manufacturer">
                  Beacon manufacturer
                </label>
                <select
                  className="govuk-select"
                  id="beacon-manufacturer"
                  name="beacon-manufacturer"
                >
                  <option value="manufacturer_1">Raleigh</option>
                  <option value="manufacturer_2">Giant</option>
                  <option value="manufacturer_3">Trek</option>
                </select>
              </div>

              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="beacon-model">
                  Beacon model
                </label>
                <select
                  className="govuk-select"
                  id="beacon-model"
                  name="beacon-manufacturer"
                >
                  <option value="model_1">Chopper</option>
                  <option value="model_2">TCR</option>
                  <option value="model_3">Madone</option>
                </select>
              </div>

              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="beacon-model">
                  15 digit beacon HEX ID
                </label>
                <input
                  className="govuk-input"
                  id="beacon-hex-id"
                  name="beacon-hex-id"
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
  </>
);

export default CheckBeaconDetails;
