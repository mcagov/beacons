import { PageURLs } from "../../src/lib/urls";
import { testAviationPleasureUse, testData } from "./happy-path-test-data.spec";

export const iCanSeeMyBeaconDetails = (): void =>
  Object.values(testData.beaconDetails).forEach((value) => cy.contains(value));

export const iCanSeeMyAdditionalBeaconInformation = (): void =>
  Object.values(testData.additionalBeaconInformation).forEach((value) =>
    cy.contains(value)
  );

export const iCanSeeMyAviationPleasureUse = (): void => {
  Object.entries(testAviationPleasureUse).forEach(([, value]) => {
    cy.get("main").contains(value);
  });
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
  Object.entries(testData.emergencyContacts).forEach(([, value]) =>
    cy.get("main").contains(value)
  );

export const iCanClickChangeLinksToEditMyRegistration = (): void => {
  cy.get("a.govuk-link")
    .contains("Change")
    .click()
    .each((link) => {
      link.click();
      cy.url().then((url_string) => {
        const url = new URL(url_string);
        pageToDataMap[url.pathname]();
      });
    });
};

const pageToDataMap = {
  [PageURLs.aboutBeaconOwner]: iCanSeeMyPersonalDetails,
  [PageURLs.beaconOwnerAddress]: iCanSeeMyAddressDetails,
  [PageURLs.emergencyContact]: iCanSeeMyEmergencyContactDetails,
  [PageURLs.beaconInformation]: iCanSeeMyBeaconDetails,
  [PageURLs.checkBeaconDetails]: iCanSeeMyAdditionalBeaconInformation,
};
