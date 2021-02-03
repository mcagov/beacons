import React, { FunctionComponent } from "react";

const IntentPage: FunctionComponent = () => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <h1 className="govuk-heading-l">UK 406MHz beacon registration</h1>

      <h2 className="govuk-heading-m">Data protection regulations</h2>

      <p className="govuk-body">
        The Maritime and Coastguard Agency (MCA) collect and retain the personal
        information provided when you register a UK coded 406 MHz beacon.
        Processing your information allows the MCA to exercise its official duty
        and to identify persons in distress and helps save lives.
      </p>

      <p className="govuk-body">
        We will retain your information until we are advised that the beacon is
        no longer active, for example it has been removed from the vessel,
        replaced or destroyed.
      </p>

      <p className="govuk-body">
        We will share your information with Global Search &amp; Rescue
        authorities and those delegated authorities, such as RNLI Lifeboats,
        Police or Rescue Helicopter crew, that are directly involved with
        investigations relating to a beacon activation.
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
        To find out more about how the MCA looks after personal data, your
        rights, and how to contact our data protection officer, please go to
        &nbsp;
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
              What is the nature of your registration request?
            </h2>
          </legend>

          <div id="waste-hint" className="govuk-hint">
            Select all that apply.
          </div>

          <div className="govuk-checkboxes">
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="create_beacon"
                name="create_beacon"
                type="checkbox"
                value="create_beacon"
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="create_beacon"
              >
                New Registration
              </label>
            </div>
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="change_beacon"
                name="change_beacon"
                type="checkbox"
                value="change_beacon"
                disabled
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="change_beacon"
              >
                Change Beacon
              </label>
            </div>
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="other"
                name="other"
                type="checkbox"
                value="other"
                disabled
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="other"
              >
                Other
              </label>
            </div>
          </div>

          <br />

          <h2 className="govuk-heading-m">
            <label htmlFor="event-name">
              If you selected other please specify your specific registration
              request
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

          <a
            href="#"
            role="button"
            draggable="false"
            className="govuk-button govuk-button--start"
            data-module="govuk-button"
          >
            Next
            <svg
              className="govuk-button__start-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="19"
              viewBox="0 0 33 40"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
          </a>
        </fieldset>
      </div>
    </div>
    <div className="govuk-grid-column-one-third">
      <a href="https://gov.uk/mca">
        <img src="../assets/images/mca-logo.png" alt="mca logo" />
      </a>
    </div>
  </div>
);

export default IntentPage;
