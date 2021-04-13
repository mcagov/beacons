import { Environment, Purpose } from "../../../../src/lib/registration/types";
import { PageURLs } from "../../../../src/lib/urls";
import {
  testAviationCommercialUseData,
  testAviationPleasureUseData,
  testAviationUseData,
} from "../happy-path-test-data.spec";
import {
  iCanEditMyAdditionalBeaconInformation,
  iCanEditMyBeaconDetails,
} from "../i-can-enter-beacon-information.spec";
import {
  iCanEditMyAddressDetails,
  iCanEditMyEmergencyContactDetails,
  iCanEditMyPersonalDetails,
} from "../i-can-enter-owner-information.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveTyped,
  iAmAt,
  iCanSeeAHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../selectors-and-assertions.spec";
import { iCanEditMyEnvironment } from "./generic.spec";

export const givenIHaveEnteredMyAviationUse = (purpose: Purpose): void => {
  thenTheUrlShouldContain(PageURLs.environment);
  givenIHaveSelected("#aviation");
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.purpose);
  iCanSeeAHeadingThatContains("aviation");
  givenIHaveSelected(`#${purpose.toLowerCase()}`);
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.activity);
  iCanSeeAHeadingThatContains("aviation");
  iCanSeeAHeadingThatContains(purpose.toLowerCase());
  switch (purpose) {
    case Purpose.COMMERCIAL:
      givenIHaveSelected(
        "#" + testAviationCommercialUseData.type.activity.toLowerCase()
      );
      break;
    case Purpose.PLEASURE:
      givenIHaveSelected(
        "#" + testAviationPleasureUseData.type.activity.toLowerCase()
      );
      break;
  }
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.aboutTheAircraft);
  iCanSeeAHeadingThatContains("aircraft");
  givenIHaveEnteredInformationAboutMyAircraft();
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.aircraftCommunications);
  givenIHaveEnteredMyAircraftCommunicationDetails();
  andIClickContinue();

  thenTheUrlShouldContain(PageURLs.moreDetails);
  givenIHaveEnteredMoreDetailsAboutMyAircraft();
  andIClickContinue();
};
export const iCanGoBackAndEditMyAviationUse = (purpose: Purpose): void => {
  whenIClickBack();
  iCanEditMyEmergencyContactDetails();
  whenIClickBack();
  iCanEditMyAddressDetails();
  whenIClickBack();
  iCanEditMyPersonalDetails();
  whenIClickBack();
  iCanEditMyAdditionalAviationUseInformation();
  whenIClickBack();
  iCanEditMyAircraftCommunications();
  whenIClickBack();
  iCanEditMyAircraftDetails();
  whenIClickBack();
  iCanEditMyActivity();
  whenIClickBack();
  iCanEditMyPurpose(purpose);
  whenIClickBack();
  iCanEditMyEnvironment(Environment.AVIATION);
  whenIClickBack();
  iCanEditMyAdditionalBeaconInformation();
  whenIClickBack();
  iCanEditMyBeaconDetails();
  whenIClickBack();
  iAmAt(PageURLs.start);
};
export const iCanEditMyAircraftCommunications = (): void => {
  const comms = testAviationUseData.communications;
  comms.checkedFields.forEach((field) =>
    cy.get(`#${field}`).should("be.checked")
  );
  cy.get("#satelliteTelephoneInput").should(
    "have.value",
    comms.satelliteTelephone
  );
  cy.get("#mobileTelephoneInput1").should("have.value", comms.mobileTelephone1);
  cy.get("#mobileTelephoneInput2").should("have.value", comms.mobileTelephone2);
  cy.get("#otherCommunicationInput").contains(comms.otherCommunication);
};
export const iCanEditMyAircraftDetails = (): void => {
  const aircraft = testAviationUseData.aircraft;
  cy.get("#maxCapacity").should("have.value", aircraft.maxCapacity);
  cy.get("#aircraftManufacturer").should("have.value", aircraft.manufacturer);
  cy.get("#principalAirport").should("have.value", aircraft.principalAirport);
  cy.get("#secondaryAirport").should("have.value", aircraft.secondaryAirport);
  cy.get("#registrationMark").should("have.value", aircraft.registrationMark);
  cy.get("#hexAddress").should("have.value", aircraft.hexAddress);
  cy.get("#cnOrMsnNumber").should("have.value", aircraft.cnOrMsnNumber);
  cy.get("#dongle-yes").should("be.checked");
  cy.get("#beaconPosition").contains(aircraft.beaconPosition);
};
export const iCanEditMyActivity = (): void => {
  cy.get(`input[value="${testAviationPleasureUseData.type.activity}"]`).should(
    "be.checked"
  );
};
const iCanEditMyAdditionalAviationUseInformation = (): void => {
  cy.get("textarea").contains(testAviationUseData.moreDetails);
};
export const iCanEditMyPurpose = (purpose: Purpose): void => {
  switch (purpose) {
    case Purpose.COMMERCIAL:
      cy.get(
        `input[value="${testAviationCommercialUseData.type.purpose}"]`
      ).should("be.checked");
      break;
    case Purpose.PLEASURE:
      cy.get(
        `input[value="${testAviationPleasureUseData.type.purpose}"]`
      ).should("be.checked");
      break;
  }
};
export const iCanSeeMyAviationUse = (purpose: Purpose): void => {
  switch (purpose) {
    case Purpose.COMMERCIAL:
      Object.values(testAviationCommercialUseData.type).forEach((value) => {
        cy.get("main").contains(value);
      });
      break;
    case Purpose.PLEASURE:
      Object.values(testAviationPleasureUseData.type).forEach((value) => {
        cy.get("main").contains(value);
      });
      break;
  }
  Object.values(testAviationUseData.aircraft).forEach((value) => {
    cy.get("main").contains(value);
  });
  cy.get("main").contains(
    testAviationUseData.communications.satelliteTelephone
  );
  cy.get("main").contains(testAviationUseData.communications.mobileTelephone1);
  cy.get("main").contains(testAviationUseData.communications.mobileTelephone2);
  cy.get("main").contains(
    testAviationUseData.communications.otherCommunication
  );
  cy.get("main").contains(testAviationUseData.moreDetails);
  cy.get("main").contains("dongle");
};
const givenIHaveEnteredInformationAboutMyAircraft = (): void => {
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.maxCapacity,
    "#maxCapacity"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.manufacturer,
    "#aircraftManufacturer"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.principalAirport,
    "#principalAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.secondaryAirport,
    "#secondaryAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.registrationMark,
    "#registrationMark"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.hexAddress,
    "#hexAddress"
  );
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.cnOrMsnNumber,
    "#cnOrMsnNumber"
  );
  givenIHaveSelected("#dongle-yes");
  givenIHaveTyped(
    testAviationPleasureUseData.aircraft.beaconPosition,
    "#beaconPosition"
  );
};
const givenIHaveEnteredMyAircraftCommunicationDetails = (): void => {
  givenIHaveSelected("#vhfRadio");
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTyped(
    testAviationUseData.communications.satelliteTelephone,
    "#satelliteTelephoneInput"
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTyped(
    testAviationUseData.communications.mobileTelephone1,
    "#mobileTelephoneInput1"
  );
  givenIHaveTyped(
    testAviationUseData.communications.mobileTelephone2,
    "#mobileTelephoneInput2"
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTyped(
    testAviationUseData.communications.otherCommunication,
    "#otherCommunicationInput"
  );
};
const givenIHaveEnteredMoreDetailsAboutMyAircraft = (): void => {
  givenIHaveTyped(testAviationUseData.moreDetails, "#moreDetails");
};
