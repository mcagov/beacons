import { testAviationPleasureUse, testData } from "./happy-path-test-data.spec";

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

export const iCanEditMyAdditionalUseInformation = (): void => {
  cy.get("textarea").contains(testAviationPleasureUse.moreDetails);
};

export const iCanEditMyAircraftCommunications = (): void => {
  const comms = testAviationPleasureUse.communications;
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
  const aircraft = testAviationPleasureUse.aircraft;
  cy.get("#maxCapacity").should("have.value", aircraft.maxCapacity);
  cy.get("#aircraftManufacturer").should("have.value", aircraft.manufacturer);
  cy.get("#principalAirport").should("have.value", aircraft.principalAirport);
  cy.get("#secondaryAirport").should("have.value", aircraft.secondaryAirport);
  cy.get("#registrationMark").should("have.value", aircraft.registrationMark);
  cy.get("#hexAddress").should("have.value", aircraft.hexAddress);
  cy.get("#cnOrMsnNumber").should("have.value", aircraft.cnOrMsnNumber);
  cy.get("#cnOrMsnNumber").should("have.value", aircraft.cnOrMsnNumber);
  cy.get("#dongle-yes").should("be.checked");
  cy.get("#beaconPosition").contains(aircraft.beaconPosition);
};

export const iCanEditMyActivity = (): void => {
  cy.get(`input[value="${testAviationPleasureUse.type.activity}"]`).should(
    "be.checked"
  );
};

export const iCanEditMyPurpose = (): void => {
  cy.get(`input[value="${testAviationPleasureUse.type.purpose}"]`).should(
    "be.checked"
  );
};

export const iCanEditMyEnvironment = (): void => {
  cy.get(`input[value="${testAviationPleasureUse.type.environment}"]`).should(
    "be.checked"
  );
};

// export const iCanGoBackToPreviousPagesAndEditMyRegistration = (
//   useType: () => void
// ): void => {
//   whenIClickBack;
// };

// export const iCanClickChangeLinksToEditMyRegistration = (): void => {
//   cy.get("a.govuk-link")
//     .contains("Change")
//     .each((link) => {
//       link.click();
//       cy.url().then((url_string) => {
//         const url = new URL(url_string);
//         pageToDataMap[url.pathname]();
//         // Go back to check-your-answers
//       });
//     });
// };
//
// const pageToDataMap = {
//   [PageURLs.aboutBeaconOwner]: iCanSeeMyPersonalDetails,
//   [PageURLs.beaconOwnerAddress]: iCanSeeMyAddressDetails,
//   [PageURLs.emergencyContact]: iCanSeeMyEmergencyContactDetails,
//   [PageURLs.beaconInformation]: iCanSeeMyBeaconDetails,
//   [PageURLs.checkBeaconDetails]: iCanSeeMyAdditionalBeaconInformation,
// };
