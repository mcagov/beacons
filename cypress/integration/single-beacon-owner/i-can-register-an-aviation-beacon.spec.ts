import { Environment, Purpose } from "../../../src/lib/registration/types";
import { PageURLs } from "../../../src/lib/urls";
import {
  testAviationCommercialUse,
  testAviationPleasureUse,
  testAviationUse,
} from "../happy-path-test-data.spec";
import {
  iCanEditMyAdditionalBeaconInformation,
  iCanEditMyAddressDetails,
  iCanEditMyBeaconDetails,
  iCanEditMyEmergencyContactDetails,
  iCanEditMyEnvironment,
  iCanEditMyPersonalDetails,
} from "../i-can-edit-previously-entered-information.spec";
import {
  andIHaveNoFurtherUses,
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyBeaconDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
} from "../i-can-enter-information";
import {
  iCanSeeMyAdditionalBeaconInformation,
  iCanSeeMyAddressDetails,
  iCanSeeMyBeaconDetails,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
} from "../i-can-see-previously-entered-information.spec";
import {
  andIClickContinue,
  givenIAmAt,
  givenIHaveSelected,
  givenIHaveTyped,
  iAmAt,
  iCanSeeAHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickBack,
} from "../selectors-and-assertions.spec";

describe("As an aviation beacon owner,", () => {
  it("I can register my beacon for pleasure purposes", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyAviationUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyAviationUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyAviationUse(Purpose.PLEASURE);
  });

  it("I can register my beacon for commercial purposes", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyAviationUse(Purpose.COMMERCIAL);
    andIHaveNoFurtherUses();

    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();

    thenTheUrlShouldContain(PageURLs.checkYourAnswers);
    iCanSeeMyBeaconDetails();
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyAviationUse(Purpose.COMMERCIAL);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
    iCanGoBackAndEditMyAviationUse(Purpose.COMMERCIAL);
  });
});

const givenIHaveEnteredMyAviationUse = (purpose: Purpose): void => {
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
        "#" + testAviationCommercialUse.type.activity.toLowerCase()
      );
      break;
    case Purpose.PLEASURE:
      givenIHaveSelected(
        "#" + testAviationPleasureUse.type.activity.toLowerCase()
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

const iCanGoBackAndEditMyAviationUse = (purpose: Purpose): void => {
  givenIAmAt(PageURLs.checkYourAnswers);
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
  const comms = testAviationUse.communications;
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
  const aircraft = testAviationUse.aircraft;
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
  cy.get(`input[value="${testAviationPleasureUse.type.activity}"]`).should(
    "be.checked"
  );
};

const iCanEditMyAdditionalAviationUseInformation = (): void => {
  cy.get("textarea").contains(testAviationUse.moreDetails);
};

export const iCanEditMyPurpose = (purpose: Purpose): void => {
  switch (purpose) {
    case Purpose.COMMERCIAL:
      cy.get(`input[value="${testAviationCommercialUse.type.purpose}"]`).should(
        "be.checked"
      );
      break;
    case Purpose.PLEASURE:
      cy.get(`input[value="${testAviationPleasureUse.type.purpose}"]`).should(
        "be.checked"
      );
      break;
  }
};

const iCanSeeMyAviationUse = (purpose: Purpose): void => {
  switch (purpose) {
    case Purpose.COMMERCIAL:
      Object.values(testAviationCommercialUse.type).forEach((value) => {
        cy.get("main").contains(value);
      });
      break;
    case Purpose.PLEASURE:
      Object.values(testAviationPleasureUse.type).forEach((value) => {
        cy.get("main").contains(value);
      });
      break;
  }
  Object.values(testAviationUse.aircraft).forEach((value) => {
    cy.get("main").contains(value);
  });
  cy.get("main").contains(testAviationUse.communications.satelliteTelephone);
  cy.get("main").contains(testAviationUse.communications.mobileTelephone1);
  cy.get("main").contains(testAviationUse.communications.mobileTelephone2);
  cy.get("main").contains(testAviationUse.communications.otherCommunication);
  cy.get("main").contains(testAviationUse.moreDetails);
  cy.get("main").contains("dongle");
};

const givenIHaveEnteredInformationAboutMyAircraft = (): void => {
  givenIAmAt(PageURLs.aboutTheAircraft);
  givenIHaveTyped(testAviationPleasureUse.aircraft.maxCapacity, "#maxCapacity");
  givenIHaveTyped(
    testAviationPleasureUse.aircraft.manufacturer,
    "#aircraftManufacturer"
  );
  givenIHaveTyped(
    testAviationPleasureUse.aircraft.principalAirport,
    "#principalAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUse.aircraft.secondaryAirport,
    "#secondaryAirport"
  );
  givenIHaveTyped(
    testAviationPleasureUse.aircraft.registrationMark,
    "#registrationMark"
  );
  givenIHaveTyped(testAviationPleasureUse.aircraft.hexAddress, "#hexAddress");
  givenIHaveTyped(
    testAviationPleasureUse.aircraft.cnOrMsnNumber,
    "#cnOrMsnNumber"
  );
  givenIHaveSelected("#dongle-yes");
  givenIHaveTyped(
    testAviationPleasureUse.aircraft.beaconPosition,
    "#beaconPosition"
  );
};

const givenIHaveEnteredMyAircraftCommunicationDetails = (): void => {
  givenIAmAt(PageURLs.aircraftCommunications);
  givenIHaveSelected("#vhfRadio");
  givenIHaveSelected("#satelliteTelephone");
  givenIHaveTyped(
    testAviationUse.communications.satelliteTelephone,
    "#satelliteTelephoneInput"
  );
  givenIHaveSelected("#mobileTelephone");
  givenIHaveTyped(
    testAviationUse.communications.mobileTelephone1,
    "#mobileTelephoneInput1"
  );
  givenIHaveTyped(
    testAviationUse.communications.mobileTelephone2,
    "#mobileTelephoneInput2"
  );
  givenIHaveSelected("#otherCommunication");
  givenIHaveTyped(
    testAviationUse.communications.otherCommunication,
    "#otherCommunicationInput"
  );
};

const givenIHaveEnteredMoreDetailsAboutMyAircraft = (): void => {
  givenIAmAt(PageURLs.moreDetails);
  givenIHaveTyped(testAviationUse.moreDetails, "#moreDetails");
};
