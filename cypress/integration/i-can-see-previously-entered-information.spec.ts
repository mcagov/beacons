import { testData } from "./happy-path-test-data.spec";

export const iCanSeeMyBeaconDetails = (): void =>
  Object.values(testData.beaconDetails).forEach((value) => cy.contains(value));

export const iCanSeeMyAdditionalBeaconInformation = (): void =>
  Object.values(testData.additionalBeaconInformation).forEach((value) =>
    cy.contains(value)
  );

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
