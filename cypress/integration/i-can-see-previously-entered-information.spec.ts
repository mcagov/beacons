import { testAviationPleasureUse, testData } from "./happy-path-test-data.spec";

export const iCanSeeMyBeaconDetails = (): void =>
  Object.values(testData.beaconDetails).forEach((value) => cy.contains(value));

export const iCanSeeMyAdditionalBeaconInformation = (): void =>
  Object.values(testData.additionalBeaconInformation).forEach((value) =>
    cy.contains(value)
  );

export const iCanSeeMyAviationPleasureUse = (): void => {
  Object.values(testAviationPleasureUse.type).forEach((value) => {
    cy.get("main").contains(value);
  });
  Object.values(testAviationPleasureUse.aircraft).forEach((value) => {
    cy.get("main").contains(value);
  });
  cy.get("main").contains(
    testAviationPleasureUse.communications.satelliteTelephone
  );
  cy.get("main").contains(
    testAviationPleasureUse.communications.mobileTelephone1
  );
  cy.get("main").contains(
    testAviationPleasureUse.communications.mobileTelephone2
  );
  cy.get("main").contains(
    testAviationPleasureUse.communications.otherCommunication
  );
  cy.get("main").contains(testAviationPleasureUse.moreDetails);
  // TODO: Test that user's dongle choice is played back on check-your-answers
  // cy.get("main").contains("Dongle")
};

export const iCanSeeMyPersonalDetails = (): void =>
  Object.values(testData.ownerDetails).forEach((value) =>
    cy.get("main").contains(value)
  );

export const iCanSeeMyAddressDetails = (): void =>
  Object.values(testData.ownerAddress).forEach((value) =>
    cy.get("main").contains(value)
  );

export const iCanSeeMyEmergencyContactDetails = (): void =>
  Object.values(testData.emergencyContacts).forEach((value) =>
    cy.get("main").contains(value)
  );
