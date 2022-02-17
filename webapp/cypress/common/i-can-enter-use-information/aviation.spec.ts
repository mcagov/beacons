import {
  Environment,
  Purpose,
} from "../../../src/lib/deprecatedRegistration/types";
import {
  CreateRegistrationPageURLs,
  GeneralPageURLs,
} from "../../../src/lib/urls";
import { makeEnumValueUserFriendly } from "../../../src/lib/writingStyle";
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
  andIHaveVisited,
  givenIHaveSelected,
  givenIHaveTyped,
  givenIHaveUnselected,
  iCanSeeAPageHeadingThatContains,
  iHaveVisited,
  whenIClickBack,
  whenIClickBackTimes,
} from "../selectors-and-assertions.spec";
import { iCanEditMyEnvironment, iCanEditMyNUses } from "./generic.spec";

export const givenIHaveEnteredMyAviationUse = (purpose: Purpose): void => {
  givenIHaveSelected("#aviation");
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("aviation");
  givenIHaveSelected(`#${purpose.toLowerCase()}`);
  andIClickContinue();

  iCanSeeAPageHeadingThatContains("aviation");
  iCanSeeAPageHeadingThatContains(purpose.toLowerCase());
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

  iCanSeeAPageHeadingThatContains("aircraft");
  givenIHaveEnteredInformationAboutMyAircraft();
  andIClickContinue();

  givenIHaveEnteredMyAircraftCommunicationDetails();
  andIClickContinue();

  givenIHaveEnteredMoreDetailsAboutMyAircraft();
  andIClickContinue();
};

export const iCanGoBackAndEditMyAviationUse = (purpose: Purpose): void => {
  whenIClickBack();
  iCanEditMyEmergencyContactDetails();
  whenIClickBack();
  iCanEditMyAddressDetails();
  whenIClickBackTimes(2);
  iCanEditMyPersonalDetails();
  whenIClickBack();
  iCanEditMyNUses(1);
  whenIClickBack();
  iCanEditMyAdditionalAviationUseInformation();
  whenIClickBack();
  iCanEditMyAircraftCommunications();
  iCanChangeMyAircraftCommunications();
  andIClickContinue();
  whenIClickBack();
  iCanViewMyChangedAircraftCommunications();
  whenIClickBack();
  iCanEditMyAircraftDetails();
  whenIClickBack();
  iCanEditMyAviationActivity();
  whenIClickBack();
  iCanEditMyAviationPurpose(purpose);
  whenIClickBack();
  iCanEditMyEnvironment(Environment.AVIATION);
  whenIClickBack();
  iCanEditMyAdditionalBeaconInformation();
  whenIClickBack();
  iCanEditMyBeaconDetails();
  whenIClickBack();
  iHaveVisited(GeneralPageURLs.start);
};

export const andIHaveEnteredMyAviationUse = givenIHaveEnteredMyAviationUse;

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

export const iCanChangeMyAircraftCommunications = (): void => {
  const comms = testAviationUseData.communications;
  comms.checkedFields.forEach((field) => givenIHaveUnselected(`#${field}`));
};

export const iCanViewMyChangedAircraftCommunications = (): void => {
  const comms = testAviationUseData.communications;

  comms.checkedFields.forEach((field) =>
    cy.get(`#${field}`).should("not.be.checked")
  );
  cy.get("#satelliteTelephoneInput").should("not.be.visible");
  cy.get("#mobileTelephoneInput1").should("not.be.visible");
  cy.get("#mobileTelephoneInput2").should("not.be.visible");
  cy.get("#otherCommunicationInput").should("not.be.visible");
  andIClickContinue();
  cy.visit(CreateRegistrationPageURLs.checkYourAnswers);
  Object.values(comms)
    .filter((value) => typeof value === "string")
    .forEach((value: string) =>
      cy.get(".govuk-summary-list__value").should("not.contain", value)
    );
  andIHaveVisited(
    CreateRegistrationPageURLs.aircraftCommunications + "?useId=0"
  );
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

export const iCanEditMyAviationActivity = (): void => {
  cy.get(`input[value="${testAviationPleasureUseData.type.activity}"]`).should(
    "be.checked"
  );
};

export const iCanEditMyAdditionalAviationUseInformation = (): void => {
  cy.get("textarea").contains(testAviationUseData.moreDetails);
};

export const iCanEditMyAviationPurpose = (purpose: Purpose): void => {
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
        cy.get("main").contains(makeEnumValueUserFriendly(value));
      });
      break;
    case Purpose.PLEASURE:
      Object.values(testAviationPleasureUseData.type).forEach((value) => {
        cy.get("main").contains(makeEnumValueUserFriendly(value));
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

export const iCanSeeMySingleAviationUse = (purpose: Purpose): void => {
  iCanSeeMyAviationUse(purpose);
  cy.get("main").should("not.contain", "Callsign");
};

export const givenIHaveEnteredInformationAboutMyAircraft = (): void => {
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

export const givenIHaveEnteredMyAircraftCommunicationDetails = (): void => {
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

export const iCanEditMyAviationEnvironment = (): void =>
  iCanEditMyEnvironment(Environment.AVIATION);
