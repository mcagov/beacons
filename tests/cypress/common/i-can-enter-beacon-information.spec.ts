import { testBeaconAndOwnerData } from "./happy-path-test-data.spec";
import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveClickedContinue,
  givenIHaveTypedInAnEmptyField,
  thenTheUrlShouldContain,
  whenIClearAndType,
} from "./selectors-and-assertions.spec";

export const givenIHaveEnteredMyBeaconDetails = (): void => {
  givenIHaveFilledInCheckBeaconDetailsPage();
  givenIHaveFilledInBeaconInformationPage();
};

export const givenIHaveFilledInCheckBeaconDetailsPage = (): void => {
  givenIHaveACookieSetAndIVisit("/register-a-beacon/check-beacon-details");
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.beaconDetails.manufacturer,
    "#manufacturer",
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.beaconDetails.model,
    "#model",
  );
  givenIHaveTypedInAnEmptyField(
    testBeaconAndOwnerData.beaconDetails.hexId,
    "#hexId",
  );
  givenIHaveClickedContinue();
};

export const givenIHaveFilledInBeaconInformationPage = (): void => {
  const beaconInfo = testBeaconAndOwnerData.additionalBeaconInformation;
  thenTheUrlShouldContain("/register-a-beacon/beacon-information");
  whenIClearAndType(beaconInfo.serialNumber, "#manufacturerSerialNumber");
  givenIHaveTypedInAnEmptyField(beaconInfo.chkCode, "#chkCode");
  givenIHaveTypedInAnEmptyField(beaconInfo.csta, "#csta");
  givenIHaveTypedInAnEmptyField(
    beaconInfo.batteryExpiryMonth.input,
    "#batteryExpiryDateMonth",
  );
  givenIHaveTypedInAnEmptyField(
    beaconInfo.batteryExpiryYear,
    "#batteryExpiryDateYear",
  );
  givenIHaveTypedInAnEmptyField(
    beaconInfo.lastServicedMonth.input,
    "#lastServicedDateMonth",
  );
  givenIHaveTypedInAnEmptyField(
    beaconInfo.lastServicedYear,
    "#lastServicedDateYear",
  );
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
