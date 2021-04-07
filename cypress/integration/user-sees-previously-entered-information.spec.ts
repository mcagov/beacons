import { testAviationPleasureUse, testData } from "./happy-path-test-data.spec";

export const iCanSeeMyBeaconInformation = (): void =>
  Object.keys(testData.beaconDetails).forEach((field) => {
    cy.contains(testData.beaconDetails[field]);
  });

export const iCanSeeMyAviationPleasureUse = (): void => {
  const fieldsHiddenOnCheckYourAnswersPage = ["otherCommunication"];

  Object.keys(testAviationPleasureUse)
    .filter((field) => !fieldsHiddenOnCheckYourAnswersPage.includes(field))
    .forEach((field) => {
      cy.contains(testAviationPleasureUse[field]);
    });
};

export const iCanSeeMyEmergencyContactDetails = (): void => {
  cy.contains(testData.emergencyContacts.emergencyContact1FullName);
  cy.contains(testData.emergencyContacts.emergencyContact1TelephoneNumber);
  cy.contains(
    testData.emergencyContacts.emergencyContact1AlternativeTelephoneNumber
  );
  cy.contains(testData.emergencyContacts.emergencyContact2FullName);
  cy.contains(testData.emergencyContacts.emergencyContact2TelephoneNumber);
  cy.contains(
    testData.emergencyContacts.emergencyContact2AlternativeTelephoneNumber
  );
  cy.contains(testData.emergencyContacts.emergencyContact3FullName);
  cy.contains(testData.emergencyContacts.emergencyContact3TelephoneNumber);
  cy.contains(
    testData.emergencyContacts.emergencyContact3AlternativeTelephoneNumber
  );
};
