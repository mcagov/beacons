import { Environment } from "../../src/lib/registration/types";
import { testBeaconAndOwnerData } from "./happy-path-test-data.spec";

export const iCanEditMyBeaconDetails = (): void =>
  Object.values(testBeaconAndOwnerData.beaconDetails).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyAdditionalBeaconInformation = (): void =>
  Object.values(
    testBeaconAndOwnerData.additionalBeaconInformation
  ).forEach((value) => cy.get(`input[value="${value}"]`));

export const iCanEditMyPersonalDetails = (): void =>
  Object.values(testBeaconAndOwnerData.ownerDetails).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyAddressDetails = (): void =>
  Object.values(testBeaconAndOwnerData.ownerAddress).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyEmergencyContactDetails = (): void =>
  Object.values(testBeaconAndOwnerData.emergencyContacts).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyEnvironment = (environment: Environment): void => {
  cy.get(`input[value="${environment}"]`).should("be.checked");
};
