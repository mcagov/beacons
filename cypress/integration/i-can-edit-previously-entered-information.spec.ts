import { Environment } from "../../src/lib/registration/types";
import { testData } from "./happy-path-test-data.spec";

export const iCanEditMyBeaconDetails = (): void =>
  Object.values(testData.beaconDetails).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyAdditionalBeaconInformation = (): void =>
  Object.values(testData.additionalBeaconInformation).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyPersonalDetails = (): void =>
  Object.values(testData.ownerDetails).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyAddressDetails = (): void =>
  Object.values(testData.ownerAddress).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyEmergencyContactDetails = (): void =>
  Object.values(testData.emergencyContacts).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyEnvironment = (environment: Environment): void => {
  cy.get(`input[value="${environment}"]`).should("be.checked");
};
