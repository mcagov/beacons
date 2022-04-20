import { testBeaconAndOwnerData } from "./happy-path-test-data.spec";
import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveClickedContinue,
  givenIHaveTyped,
  thenTheUrlShouldContain,
} from "./selectors-and-assertions.spec";

export const givenIHaveEnteredMyBeaconDetails = (): void => {
  givenIHaveFilledInCheckBeaconDetailsPage();
  givenIHaveFilledInBeaconInformationPage();
};

export const givenIHaveFilledInCheckBeaconDetailsPage = (): void => {
  givenIHaveACookieSetAndIVisit("/register-a-beacon/check-beacon-details");
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
  thenTheUrlShouldContain("/register-a-beacon/beacon-information");
  givenIHaveTyped(beaconInfo.serialNumber, "#manufacturerSerialNumber");
  givenIHaveTyped(beaconInfo.chkCode, "#chkCode");
  givenIHaveTyped(beaconInfo.csta, "#csta");
  givenIHaveTyped(
    beaconInfo.batteryExpiryMonth.input,
    "#batteryExpiryDateMonth"
  );
  givenIHaveTyped(beaconInfo.batteryExpiryYear, "#batteryExpiryDateYear");
  givenIHaveTyped(beaconInfo.lastServicedMonth.input, "#lastServicedDateMonth");
  givenIHaveTyped(beaconInfo.lastServicedYear, "#lastServicedDateYear");
  givenIHaveClickedContinue();
};

export const iCanSeeMyAdditionalBeaconInformation = (): void => {
  const expectedData = [
    testBeaconAndOwnerData.additionalBeaconInformation.serialNumber,
    testBeaconAndOwnerData.additionalBeaconInformation.chkCode,
    testBeaconAndOwnerData.additionalBeaconInformation.csta,
    testBeaconAndOwnerData.additionalBeaconInformation.batteryExpiryMonth
      .display,
    testBeaconAndOwnerData.additionalBeaconInformation.batteryExpiryYear,
    testBeaconAndOwnerData.additionalBeaconInformation.lastServicedMonth
      .display,
    testBeaconAndOwnerData.additionalBeaconInformation.lastServicedYear,
  ];

  expectedData.forEach((value) => cy.contains(value));
};
