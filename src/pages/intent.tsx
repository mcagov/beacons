import React, { FunctionComponent } from "react";
import { Button } from "../components/Button";
import { Grid } from "../components/Grid";

const IntentPage: FunctionComponent = () => (
  <>
    <Grid
      mainContent={
        <>
          <PageHeading />
          <IntentPageContent />
        </>
      }
    />
  </>
);

const PageHeading: FunctionComponent = () => (
  <h1 className="govuk-heading-l">Register a UK 406 MHz beacon</h1>
);

export const IntentPageContent: FunctionComponent = () => (
  <>
    <h2 className="govuk-heading-m">Data protection regulations</h2>

    <p className="govuk-body">
      The Maritime and Coastguard Agency (MCA) collect and retain the personal
      information provided when you register a UK coded 406 MHz beacon.
      Processing your information allows the MCA to exercise its official duty
      and to identify persons in distress and helps save lives.
    </p>

    <p className="govuk-body">
      We will retain your information until we are advised that the beacon is no
      longer active, for example it has been removed from the vessel, replaced
      or destroyed.
    </p>

    <p className="govuk-body">
      We will share your information with Global Search &amp; Rescue authorities
      and those delegated authorities, such as RNLI Lifeboats, Police or Rescue
      Helicopter crew, that are directly involved with investigations relating
      to a beacon activation.
    </p>

    <p className="govuk-body">
      Further details on Beacon Registration’s privacy policy can be found at
      &nbsp;
      <a
        className="govuk-link"
        href="https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice"
      >
        https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice
      </a>
    </p>

    <p className="govuk-body">
      To find out more about how the MCA looks after personal data, your rights,
      and how to contact our data protection officer, please go to &nbsp;
      <a
        className="govuk-link"
        href="https://www.gov.uk/government/organisations/maritime-and-coastguard-agency/about/personal-information-charter"
      >
        www.gov.uk/mca/privacy-policy
      </a>
    </p>

    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
          <h2 className="govuk-fieldset__heading">
            What you would like to do?
          </h2>
        </legend>

        <div id="waste-hint" className="govuk-hint">
          Select all that apply.
        </div>

        <div className="govuk-radios">
          <div className="govuk-radios__item">
            <input
              className="govuk-radios__input"
              id="create_beacon"
              name="create_beacon"
              type="radio"
              value="create_beacon"
            />
            <label
              className="govuk-label govuk-radios__label"
              htmlFor="create_beacon"
            >
              Register a new beacon
            </label>
          </div>
          <div className="govuk-radios__item">
            <input
              className="govuk-radios__input"
              id="change_beacon"
              name="change_beacon"
              type="radio"
              value="change_beacon"
              disabled
            />
            <label
              className="govuk-label govuk-radios__label"
              htmlFor="change_beacon"
            >
              Update details for existing beacon(s) you have already registered
            </label>
          </div>
          <div className="govuk-radios__item">
            <input
              className="govuk-radios__input"
              id="ownership"
              name="ownership"
              type="radio"
              value="ownership"
              disabled
            />
            <label
              className="govuk-label govuk-radios__label"
              htmlFor="ownership"
            >
              Change beacon ownership
            </label>
          </div>
          <div className="govuk-radios__item">
            <input
              className="govuk-radios__input"
              id="withdraw"
              name="withdraw"
              type="radio"
              value="withdraw"
              disabled
            />
            <label
              className="govuk-label govuk-radios__label"
              htmlFor="withdraw"
            >
              Withdraw a beacon
            </label>
          </div>
          <div className="govuk-radios__item">
            <input
              className="govuk-radios__input"
              id="other"
              name="other"
              type="radio"
              value="other"
              disabled
            />
            <label className="govuk-label govuk-radios__label" htmlFor="other">
              Other
            </label>
          </div>
        </div>

        <br />

        <h2 className="govuk-heading-m">
          <label htmlFor="event-name">
            If you selected &apos;Other&apos; please specify your request
          </label>
        </h2>
        <input
          className="govuk-input govuk-input-disabled"
          id="other-intent"
          name="other-intent"
          type="text"
        ></input>

        <br />
        <br />

        <Button buttonText="Continue" />
      </fieldset>
    </div>
  </>
);

export default IntentPage;
