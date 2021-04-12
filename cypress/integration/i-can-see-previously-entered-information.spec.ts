import { testBeaconAndOwnerData } from "./happy-path-test-data.spec";

export const iCanSeeMyBeaconDetails = (): void =>
  Object.values(testBeaconAndOwnerData.beaconDetails).forEach((value) =>
    cy.contains(value)
  );

export const iCanSeeMyAdditionalBeaconInformation = (): void =>
  Object.values(
    testBeaconAndOwnerData.additionalBeaconInformation
  ).forEach((value) => cy.contains(value));

export const iCanSeeMyPersonalDetails = (): void =>
  Object.values(testBeaconAndOwnerData.ownerDetails).forEach((value) =>
    cy.get("main").contains(value)
  );

export const iCanSeeMyAddressDetails = (): void =>
  Object.values(testBeaconAndOwnerData.ownerAddress).forEach((value) =>
    cy.get("main").contains(value)
  );

export const iCanSeeMyEmergencyContactDetails = (): void =>
  Object.values(testBeaconAndOwnerData.emergencyContacts).forEach((value) =>
    cy.get("main").contains(value)
  );
