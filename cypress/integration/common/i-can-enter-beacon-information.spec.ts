import { PageURLs } from "../../../src/lib/urls";
import { testBeaconAndOwnerData } from "./happy-path-test-data.spec";
import {
  andIClickContinue,
  andIHaveSelected,
  givenIHaveBeenToTheStartPageAndClickedStartNow,
  givenIHaveClickedContinue,
  givenIHaveTyped,
  thenTheUrlShouldContain,
} from "./selectors-and-assertions.spec";

export const givenIHaveEnteredMyBeaconDetails = (): void => {
  givenIHaveFilledInCheckBeaconDetailsPage();
  givenIHaveFilledInBeaconInformationPage();
};

export const givenIHaveEnteredMyRequiredBeaconDetails = (): void => {
  givenIHaveFilledInCheckBeaconDetailsPage();
  givenIHaveFilledInRequiredBeaconInformationPage();
};

export const givenIHaveFilledInCheckBeaconDetailsPage = (): void => {
  givenIHaveBeenToTheStartPageAndClickedStartNow();
  givenIHaveTyped(
    testBeaconAndOwnerData.beaconDetails.manufacturer,
    "#manufacturer"
  );
  givenIHaveTyped(testBeaconAndOwnerData.beaconDetails.model, "#model");
  givenIHaveTyped(testBeaconAndOwnerData.beaconDetails.hexId, "#hexId");
  givenIHaveClickedContinue();
};

export const givenIHaveFilledInBeaconInformationPage = (): void => {
  const beaconInfo = testBeaconAndOwnerData.additionalBeaconInformation;
  thenTheUrlShouldContain(PageURLs.beaconInformation);
  givenIHaveTyped(beaconInfo.serialNumber, "#manufacturerSerialNumber");
  givenIHaveTyped(beaconInfo.chkCode, "#chkCode");
  givenIHaveTyped(beaconInfo.batteryExpiryMonth, "#batteryExpiryDateMonth");
  givenIHaveTyped(beaconInfo.batteryExpiryYear, "#batteryExpiryDateYear");
  givenIHaveTyped(beaconInfo.lastServicedMonth, "#lastServicedDateMonth");
  givenIHaveTyped(beaconInfo.lastServicedYear, "#lastServicedDateYear");
  givenIHaveClickedContinue();
};

export const givenIHaveFilledInRequiredBeaconInformationPage = (): void => {
  const beaconInfo = testBeaconAndOwnerData.additionalBeaconInformation;
  thenTheUrlShouldContain(PageURLs.beaconInformation);
  givenIHaveTyped(beaconInfo.serialNumber, "#manufacturerSerialNumber");
  givenIHaveClickedContinue();
};

export const asAMaritimeBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#maritime");
  andIClickContinue();
};

export const asAnAviationBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#aviation");
  andIClickContinue();
};

export const asAMaritimePleasureBeaconOwner = (): void => {
  asAMaritimeBeaconOwner();
  andIHaveSelected("#pleasure");
  andIClickContinue();
};

export const asALandBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#land");
  andIClickContinue();
};

export const iCanEditMyBeaconDetails = (): void =>
  Object.values(testBeaconAndOwnerData.beaconDetails).forEach((value) =>
    cy.get(`input[value="${value}"]`)
  );

export const iCanEditMyAdditionalBeaconInformation = (): void =>
  Object.values(
    testBeaconAndOwnerData.additionalBeaconInformation
  ).forEach((value) => cy.get(`input[value="${value}"]`));

export const iCanSeeMyBeaconDetails = (): void =>
  Object.values(testBeaconAndOwnerData.beaconDetails).forEach((value) =>
    cy.contains(value)
  );

export const iCanSeeMyAdditionalBeaconInformation = (): void =>
  Object.values(
    testBeaconAndOwnerData.additionalBeaconInformation
  ).forEach((value) => cy.contains(value));

export const iCanSeeMyRequiredAdditionalBeaconInformationOrDash = (): void =>
  Object.values(testBeaconAndOwnerData.additionalBeaconInformation).forEach(
    (value) => {
      cy.contains("Additional beacon information")
        .parent()
        .contains(new RegExp(value + "|-"));
    }
  );
